import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, FolderTree } from "lucide-react";

// Tech stack logos as inline SVGs for better control
const techLogos = {
  nextjs: (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      <mask id="mask0_408_134" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#mask0_408_134)">
        <circle cx="90" cy="90" r="90" fill="currentColor" />
        <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)" />
        <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)" />
      </g>
      <defs>
        <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 256 228" className="w-full h-full">
      <path d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621 6.238-30.281 2.16-54.676-11.769-62.708-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848 155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233 50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165 167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266 13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923 168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586 13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488 29.348-9.723 48.443-25.443 48.443-41.52 0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345-3.24-10.257-7.612-21.163-12.963-32.432 5.106-11 9.31-21.767 12.459-31.957 2.619.758 5.16 1.557 7.61 2.4 23.69 8.156 38.14 20.213 38.14 29.504 0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787-1.524 8.219-4.59 13.698-8.382 15.893-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246 12.376-1.098 24.068-2.894 34.671-5.345.522 2.107.986 4.173 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994 7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863-6.35-5.437-9.555-10.836-9.555-15.216 0-9.322 13.897-21.212 37.076-29.293 2.813-.98 5.757-1.905 8.812-2.773 3.204 10.42 7.406 21.315 12.477 32.332-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789 8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152 7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793 2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433 4.902.192 9.899.29 14.978.29 5.218 0 10.376-.117 15.453-.343-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026 347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815 329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627 310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695 358.489 358.489 0 0 1 11.036 20.54 329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026-.344 1.668-.73 3.367-1.15 5.09-10.622-2.452-22.155-4.275-34.23-5.408-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86-22.86-10.235-22.86-22.86 10.235-22.86 22.86-22.86Z" fill="#00D8FF" />
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 256 256" className="w-full h-full">
      <rect width="256" height="256" rx="20" fill="#3178C6" />
      <path d="M150.518 200.475v27.095c4.347 2.218 9.555 3.892 15.623 5.023 6.068 1.131 12.538 1.697 19.409 1.697 6.747 0 13.029-.622 18.846-1.865 5.818-1.244 10.915-3.248 15.291-6.011 4.376-2.763 7.861-6.289 10.455-10.577 2.593-4.288 3.89-9.48 3.89-15.575 0-4.463-.701-8.332-2.104-11.606-1.403-3.275-3.4-6.176-5.99-8.704-2.59-2.527-5.668-4.81-9.235-6.85-3.566-2.04-7.539-3.976-11.918-5.808-3.123-1.335-5.927-2.586-8.413-3.754-2.485-1.167-4.591-2.352-6.318-3.554-1.727-1.202-3.062-2.476-4.006-3.821-.943-1.346-1.415-2.853-1.415-4.522 0-1.545.35-2.905 1.049-4.078.699-1.174 1.701-2.143 3.007-2.908 1.306-.765 2.885-1.346 4.738-1.742 1.852-.397 3.934-.595 6.244-.595 1.686 0 3.421.112 5.205.336 1.784.225 3.587.572 5.409 1.043 1.823.471 3.633 1.054 5.43 1.749 1.798.695 3.534 1.502 5.208 2.422v-25.253c-4.098-1.415-8.319-2.477-12.665-3.187-4.345-.709-9.252-1.064-14.719-1.064-6.623 0-12.644.633-18.064 1.899-5.42 1.267-10.075 3.193-13.966 5.779-3.891 2.585-6.908 5.793-9.051 9.623-2.144 3.831-3.216 8.21-3.216 13.137 0 7.584 2.206 13.978 6.618 19.183 4.412 5.205 11.149 9.582 20.211 13.131 3.741 1.498 7.106 2.913 10.095 4.245 2.989 1.332 5.527 2.681 7.615 4.048 2.087 1.367 3.693 2.813 4.817 4.337 1.125 1.525 1.687 3.23 1.687 5.116 0 1.476-.296 2.836-.888 4.079-.593 1.244-1.499 2.311-2.72 3.202-1.221.892-2.733 1.586-4.536 2.083-1.803.497-3.884.745-6.244.745-4.387 0-8.713-.698-12.978-2.094-4.265-1.395-8.345-3.323-12.241-5.781zM39.908 108.605h69.486v-22.15H11v22.15h28.908v109.44h20.949v-109.44z" fill="white" />
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 256 154" className="w-full h-full">
      <defs>
        <linearGradient x1="-2.778%" y1="32%" x2="100%" y2="67.556%" id="gradient">
          <stop stopColor="#2298BD" offset="0%"></stop>
          <stop stopColor="#0ED7B5" offset="100%"></stop>
        </linearGradient>
      </defs>
      <path d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0ZM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2 9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8Z" fill="url(#gradient)"></path>
    </svg>
  ),
  shadcn: (
    <div className="w-full h-full flex items-center justify-center font-bold text-lg">
      shadcn/ui
    </div>
  ),
  claude: (
    <svg viewBox="0 0 95 65" className="w-full h-full">
      <path d="M21.4532 40.5412L39.394 45.0099C41.2193 45.454 42.7322 46.0597 44.4577 46.0597C46.1832 46.0597 47.8166 45.454 49.5419 45.0099L67.5444 40.5412C75.1688 38.7085 81.2541 33.8516 81.2541 25.1245V24.4377C81.2541 17.4432 78.1255 10.7923 68.5893 8.7999L49.5571 3.9885C47.6192 3.42258 46.0398 3.03945 44.4577 3.03945C42.7779 3.03945 41.2498 3.42258 39.3177 3.9885L20.4083 8.7999C10.8568 10.7923 7.71875 17.4432 7.71875 24.4377V25.1245C7.71875 33.8516 13.8287 38.7085 21.4532 40.5412Z" fill="#191918"></path>
      <path d="M58.974 29.5418L49.6207 17.9396L47.9121 19.7917L56.0117 29.563L47.3822 39.5594L49.0755 41.4328L58.974 29.5418Z" fill="white"></path>
      <path d="M38.0254 17.9414L28.627 29.5436L37.2564 39.5576L38.9498 37.6842L30.8506 27.6596L39.7036 17.7936L38.0254 17.9414Z" fill="white"></path>
    </svg>
  )
};

export function ContextSection() {
  return (
    <section className="container mx-auto px-4 py-24 bg-muted/30">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline" className="mb-4">
          <Key className="w-3 h-3 mr-2" />
          Context is Key
        </Badge>
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          A Well-Defined Foundation
        </h2>
        <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
          Clear structure and proven tech stack provide the context AI needs 
          to build accurately and efficiently.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Tech Stack */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">Modern Tech Stack</h3>
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(techLogos).map(([name, logo]) => (
                <div 
                  key={name} 
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-background hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 mb-2">
                    {logo}
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {name === 'claude' ? 'Claude Code' : name === 'shadcn' ? 'shadcn/ui' : name}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Every technology chosen for AI compatibility and developer experience.
            </p>
          </CardContent>
        </Card>

        {/* Project Structure */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FolderTree className="w-5 h-5" />
              Organized Structure
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="pl-0">
                <span className="text-muted-foreground">src/</span>
              </div>
              <div className="pl-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary">├── app/</span>
                  <span className="text-xs text-muted-foreground">→ Routes only</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">├── components/</span>
                  <span className="text-xs text-muted-foreground">→ UI components</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">├── services/</span>
                  <span className="text-xs text-muted-foreground">→ Business logic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">└── specs/</span>
                  <span className="text-xs text-muted-foreground font-bold">→ Your specifications</span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-3 rounded bg-primary/10">
              <p className="text-sm text-primary font-medium">
                AI always knows where everything belongs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Message */}
      <div className="text-center mt-12">
        <p className="text-lg font-medium">
          When AI understands your project structure, it builds with precision.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          No more files in random places. No more confusion about dependencies.
        </p>
      </div>
    </section>
  );
}