export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VibeSpec',
  description: 'A template for spec-driven AI-assisted coding',
  url: 'https://vibespec.dev',
  logo: 'https://vibespec.dev/favicon_io/apple-touch-icon.png',
  sameAs: [
    'https://github.com/vibespec/vibespec',
    'https://twitter.com/vibespec',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'VibeSpec',
  description: 'Specifications first, code second. Build MVPs faster with Claude Code and structured workflows.',
  url: 'https://vibespec.dev',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://vibespec.dev/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export function generatePageSchema(page: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    datePublished: page.datePublished || new Date().toISOString(),
    dateModified: page.dateModified || new Date().toISOString(),
    publisher: organizationSchema,
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'VibeSpec Team',
    },
    publisher: organizationSchema,
    image: article.image || 'https://vibespec.dev/opengraph-image.png',
  };
}