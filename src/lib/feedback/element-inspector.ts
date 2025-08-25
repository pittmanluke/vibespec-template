export class ElementInspector {
  /**
   * Get React component name from DOM element using React Fiber
   */
  getComponentName(element: Element): string | null {
    try {
      // React 18+ stores fiber node in a property like __reactFiber$...
      const fiberKey = Object.keys(element).find(key => 
        key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
      );
      
      if (!fiberKey) return null;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fiber = (element as any)[fiberKey];
      if (!fiber) return null;
      
      // Walk up the fiber tree to find a named component
      let currentFiber = fiber;
      while (currentFiber) {
        const component = currentFiber.elementType;
        
        if (component && typeof component !== 'string') {
          // Function component or class component
          if (component.displayName) return component.displayName;
          if (component.name && component.name !== 'Component') return component.name;
        }
        
        // Check for memo wrapped components
        if (currentFiber.type && currentFiber.type.displayName) {
          return currentFiber.type.displayName;
        }
        
        currentFiber = currentFiber.return;
      }
    } catch (error) {
      console.debug('Failed to get React component name:', error);
    }
    
    return null;
  }

  /**
   * Get component file path from React DevTools if available
   */
  getComponentPath(element: Element): string | null {
    try {
      const fiberKey = Object.keys(element).find(key => 
        key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
      );
      
      if (!fiberKey) return null;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fiber = (element as any)[fiberKey];
      if (!fiber || !fiber._debugSource) return null;
      
      const { fileName, lineNumber } = fiber._debugSource;
      if (fileName) {
        // Clean up the path to be relative to src/
        const srcIndex = fileName.indexOf('/src/');
        if (srcIndex !== -1) {
          const relativePath = fileName.substring(srcIndex + 1);
          return lineNumber ? `${relativePath}:${lineNumber}` : relativePath;
        }
        return fileName;
      }
    } catch (error) {
      console.debug('Failed to get component path:', error);
    }
    
    return null;
  }

  /**
   * Generate a unique, stable CSS selector for an element
   */
  generateSelector(element: Element): string {
    const path: string[] = [];
    let current: Element | null = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      // Add ID if present
      if (current.id) {
        selector = `#${current.id}`;
        path.unshift(selector);
        break; // ID is unique, we can stop here
      }
      
      // Add classes
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/);
        const validClasses = classes.filter(cls => 
          cls && !cls.startsWith('hover:') && !cls.startsWith('focus:')
        );
        if (validClasses.length > 0) {
          selector += '.' + validClasses.slice(0, 2).join('.');
        }
      }
      
      // Add nth-child if needed for uniqueness
      const parent: Element | null = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const sameTagSiblings = siblings.filter(s => s.tagName === current!.tagName);
        
        if (sameTagSiblings.length > 1) {
          const index = sameTagSiblings.indexOf(current) + 1;
          selector += `:nth-of-type(${index})`;
        }
      }
      
      path.unshift(selector);
      current = parent;
    }
    
    return path.join(' > ');
  }

  /**
   * Generate XPath for an element (fallback when CSS selector is ambiguous)
   */
  generateXPath(element: Element): string {
    const path: string[] = [];
    let current: Element | null = element;
    
    while (current && current !== document.body) {
      const parent: Element | null = current.parentElement;
      
      if (!parent) {
        path.unshift('/' + current.tagName.toLowerCase());
        break;
      }
      
      const siblings = Array.from(parent.children);
      const sameTagSiblings = siblings.filter(s => s.tagName === current!.tagName);
      
      if (sameTagSiblings.length === 1) {
        path.unshift(current.tagName.toLowerCase());
      } else {
        const index = sameTagSiblings.indexOf(current) + 1;
        path.unshift(`${current.tagName.toLowerCase()}[${index}]`);
      }
      
      current = parent;
    }
    
    return '//' + path.join('/');
  }

  /**
   * Get computed styles for an element
   */
  getComputedStyles(element: Element): Record<string, string> {
    const computed = window.getComputedStyle(element);
    const styles: Record<string, string> = {};
    
    // Key styles we're interested in for feedback
    const relevantProps = [
      'backgroundColor',
      'color',
      'fontSize',
      'fontWeight',
      'padding',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'margin',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'border',
      'borderRadius',
      'width',
      'height',
      'display',
      'position',
      'opacity',
      'boxShadow',
      'transform',
      'transition',
    ];
    
    relevantProps.forEach(prop => {
      const value = computed.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (value && value !== 'none' && value !== '0px' && value !== 'auto') {
        styles[prop] = value;
      }
    });
    
    return styles;
  }

  /**
   * Extract Tailwind classes from an element
   */
  getTailwindClasses(element: Element): string[] {
    if (!element.className || typeof element.className !== 'string') return [];
    
    const classes = element.className.trim().split(/\s+/);
    
    // Common Tailwind prefixes
    const tailwindPrefixes = [
      'bg-', 'text-', 'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-',
      'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-',
      'w-', 'h-', 'min-w-', 'max-w-', 'min-h-', 'max-h-',
      'flex', 'grid', 'block', 'inline', 'hidden',
      'rounded', 'border', 'shadow', 'opacity',
      'hover:', 'focus:', 'active:', 'disabled:',
      'sm:', 'md:', 'lg:', 'xl:', '2xl:',
      'dark:', 'light:',
    ];
    
    return classes.filter(cls => {
      return tailwindPrefixes.some(prefix => cls.startsWith(prefix)) ||
        tailwindPrefixes.includes(cls);
    });
  }

  /**
   * Find the nearest interactive parent element
   */
  findInteractiveParent(element: Element): Element | null {
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'];
    let current: Element | null = element;
    
    while (current && current !== document.body) {
      if (interactiveTags.includes(current.tagName)) {
        return current;
      }
      
      // Check for click handlers or role attributes
      if (
        current.hasAttribute('onclick') ||
        current.hasAttribute('role') ||
        (current as HTMLElement).style.cursor === 'pointer'
      ) {
        return current;
      }
      
      current = current.parentElement;
    }
    
    return null;
  }

  /**
   * Get element's bounding box relative to viewport
   */
  getBoundingBox(element: Element): DOMRect {
    return element.getBoundingClientRect();
  }

  /**
   * Get a sanitized version of the element's inner HTML
   */
  getSanitizedInnerHTML(element: Element): string {
    const clone = element.cloneNode(true) as Element;
    
    // Remove script tags and event handlers
    clone.querySelectorAll('script').forEach(script => script.remove());
    clone.querySelectorAll('[onclick], [onload], [onerror]').forEach(el => {
      el.removeAttribute('onclick');
      el.removeAttribute('onload');
      el.removeAttribute('onerror');
    });
    
    // Truncate if too long
    const html = clone.innerHTML;
    return html.length > 500 ? html.substring(0, 500) + '...' : html;
  }

  /**
   * Check if element is visible in viewport
   */
  isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Get all data attributes from an element
   */
  getDataAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        attrs[attr.name] = attr.value;
      }
    });
    
    return attrs;
  }
}