## Theme 1: Milka

```css
:root {
  --background: oklch(0.9777 0.0041 301.4256);
  --foreground: oklch(0.3651 0.0325 287.0807);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.3651 0.0325 287.0807);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.3651 0.0325 287.0807);
  --primary: oklch(0.6104 0.0767 299.7335);
  --primary-foreground: oklch(0.9777 0.0041 301.4256);
  --secondary: oklch(0.8957 0.0265 300.2416);
  --secondary-foreground: oklch(0.3651 0.0325 287.0807);
  --muted: oklch(0.8906 0.0139 299.7754);
  --muted-foreground: oklch(0.5288 0.0375 290.7895);
  --accent: oklch(0.7889 0.0802 359.9375);
  --accent-foreground: oklch(0.3394 0.0441 1.7583);
  --destructive: oklch(0.6332 0.1578 22.6734);
  --destructive-foreground: oklch(0.9777 0.0041 301.4256);
  --border: oklch(0.8447 0.0226 300.1421);
  --input: oklch(0.9329 0.0124 301.2783);
  --ring: oklch(0.6104 0.0767 299.7335);
  --chart-1: oklch(0.6104 0.0767 299.7335);
  --chart-2: oklch(0.7889 0.0802 359.9375);
  --chart-3: oklch(0.7321 0.0749 169.8670);
  --chart-4: oklch(0.8540 0.0882 76.8292);
  --chart-5: oklch(0.7857 0.0645 258.0839);
  --sidebar: oklch(0.9554 0.0082 301.3541);
  --sidebar-foreground: oklch(0.3651 0.0325 287.0807);
  --sidebar-primary: oklch(0.6104 0.0767 299.7335);
  --sidebar-primary-foreground: oklch(0.9777 0.0041 301.4256);
  --sidebar-accent: oklch(0.7889 0.0802 359.9375);
  --sidebar-accent-foreground: oklch(0.3394 0.0441 1.7583);
  --sidebar-border: oklch(0.8719 0.0198 302.1690);
  --sidebar-ring: oklch(0.6104 0.0767 299.7335);
  --font-sans: Geist, sans-serif;
  --font-serif: "Lora", Georgia, serif;
  --font-mono: "Fira Code", "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 1px;
  --shadow-y: 2px;
  --shadow-blur: 5px;
  --shadow-spread: 1px;
  --shadow-opacity: 0.06;
  --shadow-color: hsl(0 0% 0%);
  --shadow-2xs: 1px 2px 5px 1px hsl(0 0% 0% / 0.03);
  --shadow-xs: 1px 2px 5px 1px hsl(0 0% 0% / 0.03);
  --shadow-sm: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06);
  --shadow: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06);
  --shadow-md: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 2px 4px 0px hsl(0 0% 0% / 0.06);
  --shadow-lg: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06);
  --shadow-xl: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 8px 10px 0px hsl(0 0% 0% / 0.06);
  --shadow-2xl: 1px 2px 5px 1px hsl(0 0% 0% / 0.15);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.2166 0.0215 292.8474);
  --foreground: oklch(0.9053 0.0245 293.5570);
  --card: oklch(0.2544 0.0301 292.7315);
  --card-foreground: oklch(0.9053 0.0245 293.5570);
  --popover: oklch(0.2544 0.0301 292.7315);
  --popover-foreground: oklch(0.9053 0.0245 293.5570);
  --primary: oklch(0.7058 0.0777 302.0489);
  --primary-foreground: oklch(0.2166 0.0215 292.8474);
  --secondary: oklch(0.4604 0.0472 295.5578);
  --secondary-foreground: oklch(0.9053 0.0245 293.5570);
  --muted: oklch(0.2560 0.0320 294.8380);
  --muted-foreground: oklch(0.6974 0.0282 300.0614);
  --accent: oklch(0.3181 0.0321 308.6149);
  --accent-foreground: oklch(0.8391 0.0692 2.6681);
  --destructive: oklch(0.6875 0.1420 21.4566);
  --destructive-foreground: oklch(0.2166 0.0215 292.8474);
  --border: oklch(0.3063 0.0359 293.3367);
  --input: oklch(0.2847 0.0346 291.2726);
  --ring: oklch(0.7058 0.0777 302.0489);
  --chart-1: oklch(0.7058 0.0777 302.0489);
  --chart-2: oklch(0.8391 0.0692 2.6681);
  --chart-3: oklch(0.7321 0.0749 169.8670);
  --chart-4: oklch(0.8540 0.0882 76.8292);
  --chart-5: oklch(0.7857 0.0645 258.0839);
  --sidebar: oklch(0.1985 0.0200 293.6639);
  --sidebar-foreground: oklch(0.9053 0.0245 293.5570);
  --sidebar-primary: oklch(0.7058 0.0777 302.0489);
  --sidebar-primary-foreground: oklch(0.2166 0.0215 292.8474);
  --sidebar-accent: oklch(0.3181 0.0321 308.6149);
  --sidebar-accent-foreground: oklch(0.8391 0.0692 2.6681);
  --sidebar-border: oklch(0.2847 0.0346 291.2726);
  --sidebar-ring: oklch(0.7058 0.0777 302.0489);
  --font-sans: Geist, sans-serif;
  --font-serif: "Lora", Georgia, serif;
  --font-mono: "Fira Code", "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 1px;
  --shadow-y: 2px;
  --shadow-blur: 5px;
  --shadow-spread: 1px;
  --shadow-opacity: 0.06;
  --shadow-color: hsl(0 0% 0%);
  --shadow-2xs: 1px 2px 5px 1px hsl(0 0% 0% / 0.03);
  --shadow-xs: 1px 2px 5px 1px hsl(0 0% 0% / 0.03);
  --shadow-sm: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06);
  --shadow: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06);
  --shadow-md: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 2px 4px 0px hsl(0 0% 0% / 0.06);
  --shadow-lg: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06);
  --shadow-xl: 1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 8px 10px 0px hsl(0 0% 0% / 0.06);
  --shadow-2xl: 1px 2px 5px 1px hsl(0 0% 0% / 0.15);
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
```

## Theme 2: Claude

```css
:root {
  --background: oklch(0.9818 0.0054 95.0986);
  --foreground: oklch(0.3438 0.0269 95.7226);
  --card: oklch(0.9818 0.0054 95.0986);
  --card-foreground: oklch(0.1908 0.0020 106.5859);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.2671 0.0196 98.9390);
  --primary: oklch(0.6171 0.1375 39.0427);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9245 0.0138 92.9892);
  --secondary-foreground: oklch(0.4334 0.0177 98.6048);
  --muted: oklch(0.9341 0.0153 90.2390);
  --muted-foreground: oklch(0.6059 0.0075 97.4233);
  --accent: oklch(0.9245 0.0138 92.9892);
  --accent-foreground: oklch(0.2671 0.0196 98.9390);
  --destructive: oklch(0.1908 0.0020 106.5859);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.8847 0.0069 97.3627);
  --input: oklch(0.7621 0.0156 98.3528);
  --ring: oklch(0.6171 0.1375 39.0427);
  --chart-1: oklch(0.5583 0.1276 42.9956);
  --chart-2: oklch(0.6898 0.1581 290.4107);
  --chart-3: oklch(0.8816 0.0276 93.1280);
  --chart-4: oklch(0.8822 0.0403 298.1792);
  --chart-5: oklch(0.5608 0.1348 42.0584);
  --sidebar: oklch(0.9663 0.0080 98.8792);
  --sidebar-foreground: oklch(0.3590 0.0051 106.6524);
  --sidebar-primary: oklch(0.6171 0.1375 39.0427);
  --sidebar-primary-foreground: oklch(0.9881 0 0);
  --sidebar-accent: oklch(0.9245 0.0138 92.9892);
  --sidebar-accent-foreground: oklch(0.3250 0 0);
  --sidebar-border: oklch(0.9401 0 0);
  --sidebar-ring: oklch(0.7731 0 0);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.2679 0.0036 106.6427);
  --foreground: oklch(0.8074 0.0142 93.0137);
  --card: oklch(0.2679 0.0036 106.6427);
  --card-foreground: oklch(0.9818 0.0054 95.0986);
  --popover: oklch(0.3085 0.0035 106.6039);
  --popover-foreground: oklch(0.9211 0.0040 106.4781);
  --primary: oklch(0.6724 0.1308 38.7559);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9818 0.0054 95.0986);
  --secondary-foreground: oklch(0.3085 0.0035 106.6039);
  --muted: oklch(0.2213 0.0038 106.7070);
  --muted-foreground: oklch(0.7713 0.0169 99.0657);
  --accent: oklch(0.2130 0.0078 95.4245);
  --accent-foreground: oklch(0.9663 0.0080 98.8792);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.3618 0.0101 106.8928);
  --input: oklch(0.4336 0.0113 100.2195);
  --ring: oklch(0.6724 0.1308 38.7559);
  --chart-1: oklch(0.5583 0.1276 42.9956);
  --chart-2: oklch(0.6898 0.1581 290.4107);
  --chart-3: oklch(0.2130 0.0078 95.4245);
  --chart-4: oklch(0.3074 0.0516 289.3230);
  --chart-5: oklch(0.5608 0.1348 42.0584);
  --sidebar: oklch(0.2357 0.0024 67.7077);
  --sidebar-foreground: oklch(0.8074 0.0142 93.0137);
  --sidebar-primary: oklch(0.3250 0 0);
  --sidebar-primary-foreground: oklch(0.9881 0 0);
  --sidebar-accent: oklch(0.1680 0.0020 106.6177);
  --sidebar-accent-foreground: oklch(0.8074 0.0142 93.0137);
  --sidebar-border: oklch(0.9401 0 0);
  --sidebar-ring: oklch(0.7731 0 0);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
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
```

## Theme 3: Twitter

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1.0000 0 0);
  --foreground: oklch(0.1884 0.0128 248.5103);
  --card: oklch(0.9784 0.0011 197.1387);
  --card-foreground: oklch(0.1884 0.0128 248.5103);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.1884 0.0128 248.5103);
  --primary: oklch(0.6723 0.1606 244.9955);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.1884 0.0128 248.5103);
  --secondary-foreground: oklch(1.0000 0 0);
  --muted: oklch(0.9222 0.0013 286.3737);
  --muted-foreground: oklch(0.1884 0.0128 248.5103);
  --accent: oklch(0.9392 0.0166 250.8453);
  --accent-foreground: oklch(0.6723 0.1606 244.9955);
  --destructive: oklch(0.6188 0.2376 25.7658);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.9317 0.0118 231.6594);
  --input: oklch(0.9809 0.0025 228.7836);
  --ring: oklch(0.6818 0.1584 243.3540);
  --chart-1: oklch(0.6723 0.1606 244.9955);
  --chart-2: oklch(0.6907 0.1554 160.3454);
  --chart-3: oklch(0.8214 0.1600 82.5337);
  --chart-4: oklch(0.7064 0.1822 151.7125);
  --chart-5: oklch(0.5919 0.2186 10.5826);
  --sidebar: oklch(0.9784 0.0011 197.1387);
  --sidebar-foreground: oklch(0.1884 0.0128 248.5103);
  --sidebar-primary: oklch(0.6723 0.1606 244.9955);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.9392 0.0166 250.8453);
  --sidebar-accent-foreground: oklch(0.6723 0.1606 244.9955);
  --sidebar-border: oklch(0.9271 0.0101 238.5177);
  --sidebar-ring: oklch(0.6818 0.1584 243.3540);
  --font-sans: Open Sans, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: Menlo, monospace;
  --radius: 1.3rem;
  --shadow-x: 0px;
  --shadow-y: 2px;
  --shadow-blur: 0px;
  --shadow-spread: 0px;
  --shadow-opacity: 0;
  --shadow-color: rgba(29,161,242,0.15);
  --shadow-2xs: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-xs: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-sm: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 1px 2px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 1px 2px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-md: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 2px 4px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-lg: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 4px 6px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-xl: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 8px 10px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-2xl: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0 0 0);
  --foreground: oklch(0.9328 0.0025 228.7857);
  --card: oklch(0.2097 0.0080 274.5332);
  --card-foreground: oklch(0.8853 0 0);
  --popover: oklch(0 0 0);
  --popover-foreground: oklch(0.9328 0.0025 228.7857);
  --primary: oklch(0.6692 0.1607 245.0110);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9622 0.0035 219.5331);
  --secondary-foreground: oklch(0.1884 0.0128 248.5103);
  --muted: oklch(0.2090 0 0);
  --muted-foreground: oklch(0.5637 0.0078 247.9662);
  --accent: oklch(0.1928 0.0331 242.5459);
  --accent-foreground: oklch(0.6692 0.1607 245.0110);
  --destructive: oklch(0.6188 0.2376 25.7658);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.2674 0.0047 248.0045);
  --input: oklch(0.3020 0.0288 244.8244);
  --ring: oklch(0.6818 0.1584 243.3540);
  --chart-1: oklch(0.6723 0.1606 244.9955);
  --chart-2: oklch(0.6907 0.1554 160.3454);
  --chart-3: oklch(0.8214 0.1600 82.5337);
  --chart-4: oklch(0.7064 0.1822 151.7125);
  --chart-5: oklch(0.5919 0.2186 10.5826);
  --sidebar: oklch(0.2097 0.0080 274.5332);
  --sidebar-foreground: oklch(0.8853 0 0);
  --sidebar-primary: oklch(0.6818 0.1584 243.3540);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.1928 0.0331 242.5459);
  --sidebar-accent-foreground: oklch(0.6692 0.1607 245.0110);
  --sidebar-border: oklch(0.3795 0.0220 240.5943);
  --sidebar-ring: oklch(0.6818 0.1584 243.3540);
  --font-sans: Open Sans, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: Menlo, monospace;
  --radius: 1.3rem;
  --shadow-x: 0px;
  --shadow-y: 2px;
  --shadow-blur: 0px;
  --shadow-spread: 0px;
  --shadow-opacity: 0;
  --shadow-color: rgba(29,161,242,0.25);
  --shadow-2xs: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-xs: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-sm: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 1px 2px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 1px 2px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-md: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 2px 4px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-lg: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 4px 6px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-xl: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00), 0px 8px 10px -1px hsl(202.8169 89.1213% 53.1373% / 0.00);
  --shadow-2xl: 0px 2px 0px 0px hsl(202.8169 89.1213% 53.1373% / 0.00);
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

## Theme 4: Supabase

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.9934 0.0017 174.5350);
  --foreground: oklch(0.2464 0.0358 168.9829);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.2464 0.0358 168.9829);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.2464 0.0358 168.9829);
  --primary: oklch(0.6373 0.1362 162.5170);
  --primary-foreground: oklch(0.9915 0.0116 174.2431);
  --secondary: oklch(0.9593 0.0088 174.3186);
  --secondary-foreground: oklch(0.4406 0.0740 167.5116);
  --muted: oklch(0.9572 0.0053 174.4257);
  --muted-foreground: oklch(0.5836 0.0427 172.2348);
  --accent: oklch(0.9498 0.0187 174.0039);
  --accent-foreground: oklch(0.4575 0.0843 166.1570);
  --destructive: oklch(0.6356 0.2082 25.3782);
  --destructive-foreground: oklch(0.9848 0 0);
  --border: oklch(0.9161 0.0142 174.1306);
  --input: oklch(0.9161 0.0142 174.1306);
  --ring: oklch(0.6373 0.1362 162.5170);
  --chart-1: oklch(0.6373 0.1362 162.5170);
  --chart-2: oklch(0.7303 0.1378 170.2769);
  --chart-3: oklch(0.7521 0.1557 160.2202);
  --chart-4: oklch(0.7791 0.0991 181.3409);
  --chart-5: oklch(0.8441 0.0580 172.3993);
  --sidebar: oklch(0.9861 0.0023 174.5175);
  --sidebar-foreground: oklch(0.3142 0.0494 168.2500);
  --sidebar-primary: oklch(0.6373 0.1362 162.5170);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.9470 0.0140 174.1493);
  --sidebar-accent-foreground: oklch(0.4575 0.0843 166.1570);
  --sidebar-border: oklch(0.9302 0.0118 174.2144);
  --sidebar-ring: oklch(0.6373 0.1362 162.5170);
  --font-sans: Inter, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.6rem;
  --shadow-x: 0px;
  --shadow-y: 4px;
  --shadow-blur: 12px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.06;
  --shadow-color: hsl(160 50% 10%);
  --shadow-2xs: 0px 4px 12px 0px hsl(160 50% 10% / 0.03);
  --shadow-xs: 0px 4px 12px 0px hsl(160 50% 10% / 0.03);
  --shadow-sm: 0px 4px 12px 0px hsl(160 50% 10% / 0.06), 0px 1px 2px -1px hsl(160 50% 10% / 0.06);
  --shadow: 0px 4px 12px 0px hsl(160 50% 10% / 0.06), 0px 1px 2px -1px hsl(160 50% 10% / 0.06);
  --shadow-md: 0px 4px 12px 0px hsl(160 50% 10% / 0.06), 0px 2px 4px -1px hsl(160 50% 10% / 0.06);
  --shadow-lg: 0px 4px 12px 0px hsl(160 50% 10% / 0.06), 0px 4px 6px -1px hsl(160 50% 10% / 0.06);
  --shadow-xl: 0px 4px 12px 0px hsl(160 50% 10% / 0.06), 0px 8px 10px -1px hsl(160 50% 10% / 0.06);
  --shadow-2xl: 0px 4px 12px 0px hsl(160 50% 10% / 0.15);
  --tracking-normal: -0.01em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.1396 0.0125 174.6891);
  --foreground: oklch(0.9861 0.0023 174.5175);
  --card: oklch(0.1700 0.0170 171.5548);
  --card-foreground: oklch(0.9861 0.0023 174.5175);
  --popover: oklch(0.1551 0.0146 172.7677);
  --popover-foreground: oklch(0.9861 0.0023 174.5175);
  --primary: oklch(0.7678 0.1655 162.1890);
  --primary-foreground: oklch(0.9915 0.0116 174.2431);
  --secondary: oklch(0.2539 0.0230 171.5789);
  --secondary-foreground: oklch(0.9302 0.0118 174.2144);
  --muted: oklch(0.2295 0.0197 171.7547);
  --muted-foreground: oklch(0.7443 0.0320 173.2696);
  --accent: oklch(0.2990 0.0371 170.1187);
  --accent-foreground: oklch(0.9861 0.0023 174.5175);
  --destructive: oklch(0.4344 0.1466 25.7809);
  --destructive-foreground: oklch(0.9848 0 0);
  --border: oklch(0.2852 0.0226 172.0143);
  --input: oklch(0.2852 0.0226 172.0143);
  --ring: oklch(0.7678 0.1655 162.1890);
  --chart-1: oklch(0.7678 0.1655 162.1890);
  --chart-2: oklch(0.8052 0.1423 171.7621);
  --chart-3: oklch(0.7935 0.1330 163.1545);
  --chart-4: oklch(0.6201 0.0963 179.7192);
  --chart-5: oklch(0.4814 0.0721 168.7206);
  --sidebar: oklch(0.1226 0.0122 174.7823);
  --sidebar-foreground: oklch(0.9429 0.0071 174.3678);
  --sidebar-primary: oklch(0.7678 0.1655 162.1890);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.2577 0.0270 170.9859);
  --sidebar-accent-foreground: oklch(0.9858 0.0018 174.5345);
  --sidebar-border: oklch(0.2503 0.0187 172.1743);
  --sidebar-ring: oklch(0.7678 0.1655 162.1890);
  --font-sans: Inter, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.6rem;
  --shadow-x: 0px;
  --shadow-y: 6px;
  --shadow-blur: 20px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.45;
  --shadow-color: hsl(0 0% 0%);
  --shadow-2xs: 0px 6px 20px 0px hsl(0 0% 0% / 0.23);
  --shadow-xs: 0px 6px 20px 0px hsl(0 0% 0% / 0.23);
  --shadow-sm: 0px 6px 20px 0px hsl(0 0% 0% / 0.45), 0px 1px 2px -1px hsl(0 0% 0% / 0.45);
  --shadow: 0px 6px 20px 0px hsl(0 0% 0% / 0.45), 0px 1px 2px -1px hsl(0 0% 0% / 0.45);
  --shadow-md: 0px 6px 20px 0px hsl(0 0% 0% / 0.45), 0px 2px 4px -1px hsl(0 0% 0% / 0.45);
  --shadow-lg: 0px 6px 20px 0px hsl(0 0% 0% / 0.45), 0px 4px 6px -1px hsl(0 0% 0% / 0.45);
  --shadow-xl: 0px 6px 20px 0px hsl(0 0% 0% / 0.45), 0px 8px 10px -1px hsl(0 0% 0% / 0.45);
  --shadow-2xl: 0px 6px 20px 0px hsl(0 0% 0% / 1.13);
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

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    letter-spacing: var(--tracking-normal);
  }
}
```

## Theme 5: Sakura

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.9859 0.0076 48.6568);
  --foreground: oklch(0.4279 0.0265 46.6194);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.4279 0.0265 46.6194);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.4279 0.0265 46.6194);
  --primary: oklch(0.7508 0.1610 2.6024);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9449 0.0110 54.4941);
  --secondary-foreground: oklch(0.4279 0.0265 46.6194);
  --muted: oklch(0.9687 0.0086 44.8919);
  --muted-foreground: oklch(0.6608 0.0272 49.5764);
  --accent: oklch(0.9239 0.0415 1.1045);
  --accent-foreground: oklch(0.5367 0.1530 7.7575);
  --destructive: oklch(0.6256 0.1933 23.0261);
  --destructive-foreground: oklch(0.9921 0.0017 325.5900);
  --border: oklch(0.9138 0.0146 50.7928);
  --input: oklch(0.9138 0.0146 50.7928);
  --ring: oklch(0.7508 0.1610 2.6024);
  --chart-1: oklch(0.7508 0.1610 2.6024);
  --chart-2: oklch(0.5367 0.1530 7.7575);
  --chart-3: oklch(0.7621 0.0581 33.4626);
  --chart-4: oklch(0.8619 0.0551 21.0638);
  --chart-5: oklch(0.8871 0.0223 35.1202);
  --sidebar: oklch(0.9794 0.0060 43.3363);
  --sidebar-foreground: oklch(0.4279 0.0265 46.6194);
  --sidebar-primary: oklch(0.7508 0.1610 2.6024);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.9239 0.0415 1.1045);
  --sidebar-accent-foreground: oklch(0.5367 0.1530 7.7575);
  --sidebar-border: oklch(0.9267 0.0154 48.5515);
  --sidebar-ring: oklch(0.7508 0.1610 2.6024);
  --font-sans: Inter, system-ui, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.5rem;
  --shadow-x: 0px;
  --shadow-y: 2px;
  --shadow-blur: 10px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.03;
  --shadow-color: 0 0% 0%;
  --shadow-2xs: 0px 2px 10px 0px hsl(0 0% 0% / 0.01);
  --shadow-xs: 0px 2px 10px 0px hsl(0 0% 0% / 0.01);
  --shadow-sm: 0px 2px 10px 0px hsl(0 0% 0% / 0.03), 0px 1px 2px -1px hsl(0 0% 0% / 0.03);
  --shadow: 0px 2px 10px 0px hsl(0 0% 0% / 0.03), 0px 1px 2px -1px hsl(0 0% 0% / 0.03);
  --shadow-md: 0px 2px 10px 0px hsl(0 0% 0% / 0.03), 0px 2px 4px -1px hsl(0 0% 0% / 0.03);
  --shadow-lg: 0px 2px 10px 0px hsl(0 0% 0% / 0.03), 0px 4px 6px -1px hsl(0 0% 0% / 0.03);
  --shadow-xl: 0px 2px 10px 0px hsl(0 0% 0% / 0.03), 0px 8px 10px -1px hsl(0 0% 0% / 0.03);
  --shadow-2xl: 0px 2px 10px 0px hsl(0 0% 0% / 0.07);
  --tracking-normal: -0.01em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.1979 0.0107 39.2759);
  --foreground: oklch(0.9135 0.0123 43.2722);
  --card: oklch(0.2379 0.0124 44.5317);
  --card-foreground: oklch(0.9135 0.0123 43.2722);
  --popover: oklch(0.2379 0.0124 44.5317);
  --popover-foreground: oklch(0.9135 0.0123 43.2722);
  --primary: oklch(0.7508 0.1610 2.6024);
  --primary-foreground: oklch(0.1979 0.0107 39.2759);
  --secondary: oklch(0.2696 0.0148 39.2735);
  --secondary-foreground: oklch(0.9135 0.0123 43.2722);
  --muted: oklch(0.2696 0.0148 39.2735);
  --muted-foreground: oklch(0.6608 0.0272 49.5764);
  --accent: oklch(0.2964 0.0372 5.9697);
  --accent-foreground: oklch(0.8436 0.0913 2.8077);
  --destructive: oklch(0.6256 0.1933 23.0261);
  --destructive-foreground: oklch(0.9921 0.0017 325.5900);
  --border: oklch(0.2937 0.0152 45.3658);
  --input: oklch(0.2937 0.0152 45.3658);
  --ring: oklch(0.7508 0.1610 2.6024);
  --chart-1: oklch(0.7508 0.1610 2.6024);
  --chart-2: oklch(0.8436 0.0913 2.8077);
  --chart-3: oklch(0.7621 0.0581 33.4626);
  --chart-4: oklch(0.4279 0.0265 46.6194);
  --chart-5: oklch(0.2937 0.0152 45.3658);
  --sidebar: oklch(0.1740 0.0094 42.9895);
  --sidebar-foreground: oklch(0.9135 0.0123 43.2722);
  --sidebar-primary: oklch(0.7508 0.1610 2.6024);
  --sidebar-primary-foreground: oklch(0.1979 0.0107 39.2759);
  --sidebar-accent: oklch(0.2964 0.0372 5.9697);
  --sidebar-accent-foreground: oklch(0.8436 0.0913 2.8077);
  --sidebar-border: oklch(0.2696 0.0148 39.2735);
  --sidebar-ring: oklch(0.7508 0.1610 2.6024);
  --font-sans: Inter, system-ui, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.5rem;
  --shadow-x: 0px;
  --shadow-y: 4px;
  --shadow-blur: 15px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.3;
  --shadow-color: 0 0% 0%;
  --shadow-2xs: 0px 4px 15px 0px hsl(0 0% 0% / 0.15);
  --shadow-xs: 0px 4px 15px 0px hsl(0 0% 0% / 0.15);
  --shadow-sm: 0px 4px 15px 0px hsl(0 0% 0% / 0.30), 0px 1px 2px -1px hsl(0 0% 0% / 0.30);
  --shadow: 0px 4px 15px 0px hsl(0 0% 0% / 0.30), 0px 1px 2px -1px hsl(0 0% 0% / 0.30);
  --shadow-md: 0px 4px 15px 0px hsl(0 0% 0% / 0.30), 0px 2px 4px -1px hsl(0 0% 0% / 0.30);
  --shadow-lg: 0px 4px 15px 0px hsl(0 0% 0% / 0.30), 0px 4px 6px -1px hsl(0 0% 0% / 0.30);
  --shadow-xl: 0px 4px 15px 0px hsl(0 0% 0% / 0.30), 0px 8px 10px -1px hsl(0 0% 0% / 0.30);
  --shadow-2xl: 0px 4px 15px 0px hsl(0 0% 0% / 0.75);
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

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    letter-spacing: var(--tracking-normal);
  }
}
```

## Theme 6: Perplexity

```css
:root {
  --background: oklch(0.9902 0.0039 106.4715);
  --foreground: oklch(0.3043 0.0394 214.0798);
  --card: oklch(0.9992 0.0039 106.4707);
  --card-foreground: oklch(0.0000 0.0000 0.0000);
  --popover: oklch(0.9992 0.0039 106.4707);
  --popover-foreground: oklch(0.0000 0.0000 0.0000);
  --primary: oklch(0.5322 0.0910 205.7465);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.9004 0.0101 212.5234);
  --secondary-foreground: oklch(0.3043 0.0394 214.0798);
  --muted: oklch(0.9297 0.0066 208.7822);
  --muted-foreground: oklch(0.5292 0.0153 214.4327);
  --accent: oklch(0.9410 0.0159 196.8866);
  --accent-foreground: oklch(0.0000 0.0000 0.0000);
  --destructive: oklch(0.6337 0.1570 54.9611);
  --destructive-foreground: oklch(0.0000 0.0000 0.0000);
  --border: oklch(0.9289 0.0034 145.5484);
  --input: oklch(0.9902 0.0039 106.4715);
  --ring: oklch(0.6312 0.0912 206.5386);
  --sidebar: oklch(0.9628 0.0066 106.5233);
  --sidebar-foreground: oklch(0.0000 0.0000 0.0000);
  --sidebar-primary: oklch(0.5322 0.0910 205.7465);
  --sidebar-primary-foreground: oklch(1.0000 0.0000 0.0000);
  --sidebar-accent: oklch(0.9992 0.0039 106.4707);
  --sidebar-accent-foreground: oklch(0.0000 0.0000 0.0000);
  --sidebar-border: oklch(0.8736 0.0091 214.3465);
  --sidebar-ring: oklch(0.6312 0.0912 206.5386);
  --chart-1: oklch(0.6267 0.1054 204.7118);
  --chart-2: oklch(0.5443 0.1104 255.9391);
  --chart-3: oklch(0.7877 0.0910 204.4517);
  --chart-4: oklch(0.3858 0.0942 255.9170);
  --chart-5: oklch(0.4406 0.0756 207.3871);
  --radius: 0.75rem;
  --letter-spacing: 0em;
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-mono: JetBrains Mono, ui-monospace, SFMono-Regular, monospace;
  --font-serif: Georgia, Cambria, "Times New Roman", serif;
  --radius-sm: 0.563rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.125rem;
  --radius-xl: 1.500rem;
  --shadow-x: 0px;
  --shadow-y: 0px;
  --shadow-blur: 1px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.07;
  --shadow-color: oklch(0.0000 0.0000 0.0000);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
  --shadow-2xs: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.04);
  --shadow-xs: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.04);
  --shadow-sm: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.07), 0px 1px 2px -1px oklch(0.0000 0.0000 0.0000 / 0.07);
  --shadow: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.07), 0px 1px 2px -1px oklch(0.0000 0.0000 0.0000 / 0.07);
  --shadow-md: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.07), 0px 2px 4px -1px oklch(0.0000 0.0000 0.0000 / 0.07);
  --shadow-lg: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.07), 0px 4px 6px -1px oklch(0.0000 0.0000 0.0000 / 0.07);
  --shadow-xl: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.07), 0px 8px 10px -1px oklch(0.0000 0.0000 0.0000 / 0.07);
  --shadow-2xl: 0px 0px 1px 0px oklch(0.0000 0.0000 0.0000 / 0.18);
}

.dark {
  --background: oklch(0.2167 0.0015 197.0427);
  --foreground: oklch(0.9836 0.0021 197.1231);
  --card: oklch(0.2167 0.0015 197.0427);
  --card-foreground: oklch(1.0000 0.0000 0.0000);
  --popover: oklch(0.1856 0.0016 197.0184);
  --popover-foreground: oklch(1.0000 0.0000 0.0000);
  --primary: oklch(0.7216 0.1120 204.7055);
  --primary-foreground: oklch(0.0000 0.0000 0.0000);
  --secondary: oklch(0.3697 0.0080 196.8121);
  --secondary-foreground: oklch(0.9836 0.0021 197.1231);
  --muted: oklch(0.3123 0.0069 196.8025);
  --muted-foreground: oklch(0.7138 0.0023 197.1059);
  --accent: oklch(0.3030 0.0352 216.5952);
  --accent-foreground: oklch(1.0000 0.0000 0.0000);
  --destructive: oklch(0.7297 0.1130 55.5280);
  --destructive-foreground: oklch(0.0000 0.0000 0.0000);
  --border: oklch(0.2972 0.0056 196.8536);
  --input: oklch(0.2457 0.0030 196.9624);
  --ring: oklch(0.6234 0.1065 205.4181);
  --sidebar: oklch(0.2457 0.0030 196.9624);
  --sidebar-foreground: oklch(1.0000 0.0000 0.0000);
  --sidebar-primary: oklch(0.7216 0.1120 204.7055);
  --sidebar-primary-foreground: oklch(0.0000 0.0000 0.0000);
  --sidebar-accent: oklch(0.1765 0.0016 197.0094);
  --sidebar-accent-foreground: oklch(1.0000 0.0000 0.0000);
  --sidebar-border: oklch(0.2624 0.0029 196.9776);
  --sidebar-ring: oklch(0.6234 0.1065 205.4181);
  --chart-1: oklch(0.6267 0.1054 204.7118);
  --chart-2: oklch(0.6074 0.0517 245.8473);
  --chart-3: oklch(0.7877 0.0910 204.4517);
  --chart-4: oklch(0.4214 0.0452 246.6475);
  --chart-5: oklch(0.4406 0.0756 207.3871);
  --radius: 0.75rem;
  --letter-spacing: 0em;
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-mono: JetBrains Mono, ui-monospace, SFMono-Regular, monospace;
  --font-serif: Georgia, Cambria, "Times New Roman", serif;
  --radius-sm: 0.563rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.125rem;
  --radius-xl: 1.500rem;
  --shadow-x: 0px;
  --shadow-y: 0px;
  --shadow-blur: 15px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.17;
  --shadow-color: oklch(0.0000 0.0000 0.0000);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
  --shadow-2xs: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.09);
  --shadow-xs: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.09);
  --shadow-sm: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.17), 0px 1px 2px -1px oklch(0.0000 0.0000 0.0000 / 0.17);
  --shadow: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.17), 0px 1px 2px -1px oklch(0.0000 0.0000 0.0000 / 0.17);
  --shadow-md: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.17), 0px 2px 4px -1px oklch(0.0000 0.0000 0.0000 / 0.17);
  --shadow-lg: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.17), 0px 4px 6px -1px oklch(0.0000 0.0000 0.0000 / 0.17);
  --shadow-xl: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.17), 0px 8px 10px -1px oklch(0.0000 0.0000 0.0000 / 0.17);
  --shadow-2xl: 0px 0px 15px 0px oklch(0.0000 0.0000 0.0000 / 0.43);
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
```
