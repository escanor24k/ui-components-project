# Glass UI Component Library

Persönliche Sammlung von 59 handgebauten React UI-Komponenten mit Glass-Morphism Design. Wird seit längerem lokal entwickelt und hier als persönliches Backup gepflegt.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- **Lucide Icons**

Keine externen UI-Libraries - alle Komponenten sind from Scratch gebaut.

## Komponenten (59)

| Kategorie | Komponenten |
|---|---|
| **Form & Input** | Avatar, Input, Textarea, Select, FormField, SearchInput, Switch, Checkbox, RadioGroup, RangeSlider, TagInput, OTPInput, NumberInput, FileDropzone, AutocompleteInput, Combobox, MultiSelect, DatePicker |
| **Data Display** | Table, DataTable, TreeView, DescriptionList, Badge, StatCard, Card, ChangelogEntry, Timeline, Rating, ProgressBar, CircularProgress, CountUp, CodeBlock |
| **Feedback & Overlay** | Modal, Drawer, Toast, Tooltip, Popover, Dropdown, ContextMenu, Banner, Alert, EmptyState, Spinner, Skeleton |
| **Navigation & Layout** | Tabs, Breadcrumb, Pagination, Stepper, Accordion, Separator |
| **Advanced** | KanbanBoard, SortableList, Calendar, Marquee |
| **Marketing** | PricingCard, TestimonialCard, AvatarGroup, CopyButton, Button |

## Setup

```bash
npm install
npm run dev
```

Läuft unter [http://localhost:3000](http://localhost:3000).

## Design

Alle Komponenten folgen einem einheitlichen Glass-UI-Stil mit:

- Transluzente Hintergründe (`bg-white/X`)
- Dark Mode Support
- Opake Overlay-Panels (Dropdowns, Menus, Popovers) zur Vermeidung von `backdrop-filter` Compositing-Konflikten
- Konsistentes Farbschema ueber CSS Custom Properties
