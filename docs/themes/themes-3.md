## Theme 9: IBM

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.9818 0.0054 95.0986);
  --foreground: oklch(0.145 0 0);
  --card: oklch(0.9818 0.0054 95.0986);
  --card-foreground: #oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2671 0.0196 98.939);
  --primary: oklch(0.704 0.04 256.788);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.869 0.022 252.894);
  --secondary-foreground: oklch(0.372 0.044 257.287);
  --muted: oklch(0.923 0.003 48.717);
  --muted-foreground: oklch(0.553 0.013 58.071);
  --accent: oklch(0.9245 0.0138 92.9892);
  --accent-foreground: oklch(0.2333 0.0195 275.9526);
  --destructive: oklch(0.1908 0.002 106.5859);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.869 0.005 56.366);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.554 0.046 257.417);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.811 0.111 293.571);
  --chart-3: oklch(0.8816 0.0276 93.128);
  --chart-4: oklch(0.704 0.04 256.788);
  --chart-5: oklch(0.588 0.158 241.966);
  --sidebar: oklch(0.9663 0.008 98.8792);
  --sidebar-foreground: oklch(0.268 0.007 34.298);
  --sidebar-primary: oklch(0.554 0.046 257.417);
  --sidebar-primary-foreground: oklch(0.9881 0 0);
  --sidebar-accent: oklch(0.9245 0.0138 92.9892);
  --sidebar-accent-foreground: oklch(0.325 0 0);
  --sidebar-border: oklch(0.869 0.022 252.894);
  --sidebar-ring: oklch(0.704 0.04 256.788);
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.22rem;
}

.dark {
  --background: oklch(0.2679 0.0036 106.6427);
  --foreground: oklch(0.8074 0.0142 93.0137);
  --card: oklch(0.2679 0.0036 106.6427);
  --card-foreground: oklch(0.9818 0.0054 95.0986);
  --popover: oklch(0.3085 0.0035 106.6039);
  --popover-foreground: oklch(0.9211 0.004 106.4781);
  --primary: oklch(0.901 0.058 230.902);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.9818 0.0054 95.0986);
  --secondary-foreground: oklch(0.3085 0.0035 106.6039);
  --muted: oklch(0.2213 0.0038 106.707);
  --muted-foreground: oklch(0.7713 0.0169 99.0657);
  --accent: oklch(0.213 0.0078 95.4245);
  --accent-foreground: oklch(0.9663 0.008 98.8792);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.3618 0.0101 106.8928);
  --input: oklch(0.4336 0.0113 100.2195);
  --ring: oklch(0.869 0.022 252.894);
  --chart-1: oklch(0.746 0.16 232.661);
  --chart-2: oklch(0.811 0.111 293.571);
  --chart-3: oklch(0.923 0.003 48.717);
  --chart-4: oklch(0.554 0.046 257.417);
  --chart-5: oklch(0.956 0.045 203.388);
  --sidebar: oklch(0.2357 0.0024 67.7077);
  --sidebar-foreground: oklch(0.8074 0.0142 93.0137);
  --sidebar-primary: oklch(0.325 0 0);
  --sidebar-primary-foreground: oklch(0.9881 0 0);
  --sidebar-accent: oklch(0.168 0.002 106.6177);
  --sidebar-accent-foreground: oklch(0.8074 0.0142 93.0137);
  --sidebar-border: oklch(0.9401 0 0);
  --sidebar-ring: oklch(0.7731 0 0);
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Theme 10: Snapchat

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2178 0 0);
  --card: oklch(0.9938 0.0013 106.4231);
  --card-foreground: oklch(0.2393 0 0);
  --popover: oklch(0.9938 0.0013 106.4231);
  --popover-foreground: oklch(0.2393 0 0);
  --primary: oklch(0.8223 0.1648 86.7192);
  --primary-foreground: oklch(0.3407 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.2686 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.464 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.5348 0.1072 86.8308);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.8852 0.0126 91.5295);
  --ring: oklch(0.8223 0.1648 86.7192);
  --chart-1: oklch(0.81 0.1 252);
  --chart-2: oklch(0.7204 0.1473 60.6715);
  --chart-3: oklch(0.6323 0.1623 252.0967);
  --chart-4: oklch(0.617 0.1909 24.6833);
  --chart-5: oklch(0.6759 0.1634 150.2272);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.2178 0 0);
  --sidebar-primary: oklch(0.8223 0.1648 86.7192);
  --sidebar-primary-foreground: oklch(0 0 0);
  --sidebar-accent: oklch(0.9229 0.0505 90.9613);
  --sidebar-accent-foreground: oklch(0.5863 0.118 86.1524);
  --sidebar-border: oklch(0.8723 0.0153 94.2191);
  --sidebar-ring: oklch(0.8223 0.1648 86.7192);
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 1.4rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.01;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 1px 2px -1px hsl(0 0% 0% / 0.01);
  --shadow:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 1px 2px -1px hsl(0 0% 0% / 0.01);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 2px 4px -1px hsl(0 0% 0% / 0.01);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 4px 6px -1px hsl(0 0% 0% / 0.01);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 8px 10px -1px hsl(0 0% 0% / 0.01);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.03);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.9401 0 0);
  --card: oklch(0.1913 0 0);
  --card-foreground: oklch(0.9401 0 0);
  --popover: oklch(0.2178 0 0);
  --popover-foreground: oklch(0.9401 0 0);
  --primary: oklch(0.8223 0.1648 86.7192);
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.9401 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.683 0 0);
  --accent: oklch(0.9508 0.0657 91.1875);
  --accent-foreground: oklch(0.1913 0 0);
  --destructive: oklch(0.6453 0.2404 27.3106);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.2478 0 0);
  --input: oklch(0.3407 0 0);
  --ring: oklch(0.8223 0.1648 86.7192);
  --chart-1: oklch(0.8223 0.1648 86.7192);
  --chart-2: oklch(0.7204 0.1473 60.6715);
  --chart-3: oklch(0.6693 0.1427 250.8035);
  --chart-4: oklch(0.6762 0.3056 327.4089);
  --chart-5: oklch(0.6759 0.1634 150.2272);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.9401 0 0);
  --sidebar-primary: oklch(0.8223 0.1648 86.7192);
  --sidebar-primary-foreground: oklch(0 0 0);
  --sidebar-accent: oklch(0.3019 0.0263 91.8088);
  --sidebar-accent-foreground: oklch(0.8223 0.1648 86.7192);
  --sidebar-border: oklch(0.3012 0 0);
  --sidebar-ring: oklch(0.8223 0.1648 86.7192);
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 1.4rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.01;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 1px 2px -1px hsl(0 0% 0% / 0.01);
  --shadow:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 1px 2px -1px hsl(0 0% 0% / 0.01);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 2px 4px -1px hsl(0 0% 0% / 0.01);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 4px 6px -1px hsl(0 0% 0% / 0.01);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.01), 0 8px 10px -1px hsl(0 0% 0% / 0.01);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.03);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Theme 11: Twitch

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.994 0 0);
  --foreground: oklch(0.2221 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2221 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2221 0 0);
  --primary: oklch(0.7905 0.1127 297.7289);
  --primary-foreground: oklch(0.2221 0 0);
  --secondary: oklch(0.2221 0 0);
  --secondary-foreground: oklch(0.994 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.81 0.1 252);
  --chart-2: oklch(0.62 0.19 260);
  --chart-3: oklch(0.55 0.22 263);
  --chart-4: oklch(0.49 0.22 264);
  --chart-5: oklch(0.42 0.18 266);
  --sidebar: oklch(0.2221 0 0);
  --sidebar-foreground: oklch(0.994 0 0);
  --sidebar-primary: oklch(0.7905 0.1127 297.7289);
  --sidebar-primary-foreground: oklch(0.2221 0 0);
  --sidebar-accent: oklch(0.2809 0 0);
  --sidebar-accent-foreground: oklch(0.994 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
  --font-sans: Open Sans, ui-sans-serif, sans-serif, system-ui;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.85rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.03;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 1px 2px -1px hsl(0 0% 0% / 0.03);
  --shadow:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 1px 2px -1px hsl(0 0% 0% / 0.03);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 2px 4px -1px hsl(0 0% 0% / 0.03);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 4px 6px -1px hsl(0 0% 0% / 0.03);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 8px 10px -1px hsl(0 0% 0% / 0.03);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.07);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.2221 0 0);
  --foreground: oklch(0.994 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.994 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.994 0 0);
  --primary: oklch(0.7905 0.1127 297.7289);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.994 0 0);
  --secondary-foreground: oklch(0.2221 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.275 0 0);
  --input: oklch(0.325 0 0);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.81 0.1 252);
  --chart-2: oklch(0.62 0.19 260);
  --chart-3: oklch(0.55 0.22 263);
  --chart-4: oklch(0.49 0.22 264);
  --chart-5: oklch(0.42 0.18 266);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.7905 0.1127 297.7289);
  --sidebar-primary-foreground: oklch(0.2221 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.275 0 0);
  --sidebar-ring: oklch(0.439 0 0);
  --font-sans: Open Sans, ui-sans-serif, sans-serif, system-ui;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.85rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.03;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.01);
  --shadow-sm:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 1px 2px -1px hsl(0 0% 0% / 0.03);
  --shadow:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 1px 2px -1px hsl(0 0% 0% / 0.03);
  --shadow-md:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 2px 4px -1px hsl(0 0% 0% / 0.03);
  --shadow-lg:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 4px 6px -1px hsl(0 0% 0% / 0.03);
  --shadow-xl:
    0 1px 3px 0px hsl(0 0% 0% / 0.03), 0 8px 10px -1px hsl(0 0% 0% / 0.03);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.07);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Theme 12: Discord

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.9881 0 0);
  --foreground: oklch(0.2789 0.0091 285.7942);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2789 0.0091 285.7942);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2789 0.0091 285.7942);
  --primary: oklch(0.5774 0.2091 273.8504);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.9614 0.0013 286.375);
  --secondary-foreground: oklch(0.2789 0.0091 285.7942);
  --muted: oklch(0.9731 0 0);
  --muted-foreground: oklch(0.537 0.014 280.8555);
  --accent: oklch(0.9497 0.0027 286.349);
  --accent-foreground: oklch(0.2789 0.0091 285.7942);
  --destructive: oklch(0.5156 0.181 22.5393);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.9042 0.0027 286.3457);
  --input: oklch(0.9614 0.0013 286.375);
  --ring: oklch(0.5774 0.2091 273.8504);
  --chart-1: oklch(0.8092 0.1122 345.1956);
  --chart-2: oklch(0.8757 0.0979 83.6546);
  --chart-3: oklch(0.9075 0.0946 165.054);
  --chart-4: oklch(0.8406 0.0699 242.1914);
  --chart-5: oklch(0.7865 0.1232 309.4396);
  --sidebar: oklch(0.9644 0.0013 286.3751);
  --sidebar-foreground: oklch(0.516 0.0141 280.8326);
  --sidebar-primary: oklch(0.8984 0.0041 286.3179);
  --sidebar-primary-foreground: oklch(0.2789 0.0091 285.7942);
  --sidebar-accent: oklch(0.9285 0.0027 286.3475);
  --sidebar-accent-foreground: oklch(0.2789 0.0091 285.7942);
  --sidebar-border: oklch(0.8862 0.0041 286.3164);
  --sidebar-ring: oklch(0.7151 0.1523 235.2888);
  --font-sans: Noto Sans JP, ui-sans-serif, sans-serif, system-ui;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.625rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 0px;
  --shadow-spread: 0px;
  --shadow-opacity: 0;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 0px 0px hsl(0 0% 0% / 0);
  --shadow-xs: 0 1px 0px 0px hsl(0 0% 0% / 0);
  --shadow-sm: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow-md: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 2px 4px -1px hsl(0 0% 0% / 0);
  --shadow-lg: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 4px 6px -1px hsl(0 0% 0% / 0);
  --shadow-xl: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 8px 10px -1px hsl(0 0% 0% / 0);
  --shadow-2xl: 0 1px 0px 0px hsl(0 0% 0% / 0);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.3225 0.0107 278.2517);
  --foreground: oklch(1 0 0);
  --card: oklch(0.3502 0.0122 279.2835);
  --card-foreground: oklch(1 0 0);
  --popover: oklch(0.3502 0.0122 279.2835);
  --popover-foreground: oklch(1 0 0);
  --primary: oklch(0.5774 0.2091 273.8504);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.3779 0.0118 285.8207);
  --secondary-foreground: oklch(1 0 0);
  --muted: oklch(0.3066 0.0108 278.2166);
  --muted-foreground: oklch(0.723 0.0087 278.582);
  --accent: oklch(0.4074 0.0134 280.1154);
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0.8004 0.1141 23.185);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.369 0.0103 278.3345);
  --input: oklch(0.3066 0.0108 278.2166);
  --ring: oklch(0.5774 0.2091 273.8504);
  --chart-1: oklch(0.8092 0.1122 345.1956);
  --chart-2: oklch(0.8757 0.0979 83.6546);
  --chart-3: oklch(0.9075 0.0946 165.054);
  --chart-4: oklch(0.8406 0.0699 242.1914);
  --chart-5: oklch(0.7865 0.1232 309.4396);
  --sidebar: oklch(0.2981 0.0091 276.8201);
  --sidebar-foreground: oklch(0.6876 0.0102 279.6082);
  --sidebar-primary: oklch(0.3804 0.0102 278.3511);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.3309 0.0087 285.9137);
  --sidebar-accent-foreground: oklch(1 0 0);
  --sidebar-border: oklch(0.3494 0.0087 276.903);
  --sidebar-ring: oklch(0.7151 0.1523 235.2888);
  --font-sans: Noto Sans JP, ui-sans-serif, sans-serif, system-ui;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  --radius: 0.625rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 0px;
  --shadow-spread: 0px;
  --shadow-opacity: 0;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 0px 0px hsl(0 0% 0% / 0);
  --shadow-xs: 0 1px 0px 0px hsl(0 0% 0% / 0);
  --shadow-sm: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow-md: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 2px 4px -1px hsl(0 0% 0% / 0);
  --shadow-lg: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 4px 6px -1px hsl(0 0% 0% / 0);
  --shadow-xl: 0 1px 0px 0px hsl(0 0% 0% / 0), 0 8px 10px -1px hsl(0 0% 0% / 0);
  --shadow-2xl: 0 1px 0px 0px hsl(0 0% 0% / 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```
