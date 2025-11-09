import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Store = {
  name: string;
  address: string;
  scheduleToday: string;
  schedule: string[];
};

@Component({
  selector: 'app-our-stores',
  imports: [FormsModule],
  templateUrl: './our-stores.html',
  styleUrl: './our-stores.scss'
})
export class OurStores {
  protected activeIndex: number | null = null;
  protected searchTerm: string = '';
  protected filteredStores: Store[] = [];

  constructor() {
    this.filteredStores = this.stores;
  }

  protected filterStores(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredStores = this.stores;
      return;
    }

    this.filteredStores = this.stores.filter(store => 
      store.name.toLowerCase().includes(term) ||
      store.address.toLowerCase().includes(term)
    );
  }

protected scheduleToday() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

  protected openOrClose(item: Store): boolean {
    // Current time with minutes precision
    const now = new Date();
    const current = now.getHours() + now.getMinutes() / 60;

    // Example line: "Lunes: 08:00 a. m. - 9:00 p. m." or "Lunes: 8:00 a.m. - 9:00 p.m."
    const todayLine = item.schedule[this.scheduleToday()];

    // Grab the part after the first ':' to skip the day name
    const firstColon = todayLine.indexOf(':');
    const rangePart = firstColon !== -1 ? todayLine.slice(firstColon + 1) : todayLine;

    // Split by '-' robustly (with/without surrounding spaces)
    const parts = rangePart.split('-').map(p => p.trim());
    if (parts.length < 2) return false; // fallback safe

    const hourOpen = this.toHour(parts[0]);
    const hourClose = this.toHour(parts[1]);

    if (isNaN(hourOpen) || isNaN(hourClose)) return false; // cannot determine -> closed by default

    return (hourOpen <= current && current < hourClose);
  }

protected toHour(time: string): number {
  // Normalize: remove dots and spaces, keep lowercase
  const cleaned = time
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ''); // "08:00am", "9:00pm"

  const match = cleaned.match(/^(\d{1,2}):(\d{2})(am|pm)?$/);
  if (!match) return NaN;

  let h = Number(match[1]);
  const m = Number(match[2]);
  const suffix = match[3]; // am | pm | undefined

  if (suffix === 'pm' && h !== 12) h += 12;
  if (suffix === 'am' && h === 12) h = 0;

  return h + m / 60;
}

  protected toggleCollapse(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  // Build a Google Maps directions URL to a given address (optionally including the store name for better results)
  protected mapUrlFromAddress(address: string, name?: string): string {
    const query = name ? `${name} ${address}` : address;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  protected readonly stores: Store[] = [
    {
      name: "Alkosto Avenida 68",
      address: "Av Cr 68 No. 72 - 43",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Barranquilla",
      address: "Calle 98 No. 51B - 91, Sector Buenavista",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 8:00 a.m. - 9:00 p.m.",
        "Martes: 8:00 a.m. - 9:00 p.m.",
        "Miércoles: 8:00 a.m. - 9:00 p.m.",
        "Jueves: 8:00 a.m. - 9:00 p.m.",
        "Viernes: 8:00 a.m. - 9:00 p.m.",
        "Sábado: 8:00 a.m. - 9:00 p.m.",
        "Domingo: 8:00 a.m. - 9:00 p.m.",
      ]
    },
    {
      name: "Alkosto Bolívar",
      address: "Av Cr 68 No. 72 - 43, Bogotá",
      scheduleToday: "Cl 22 No. 6 - 28, Avenida Bolívar",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Cali Norte",
      address: "Cr 1 con, Cl. 62 Nte",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Cali Sur",
      address: "Cl 13 No. 80 - 187",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Calle 170",
      address: "Cr 69 No. 170 - 15",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Carrera 30",
      address: "Cr 30 No. 10 - 25",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto El Edén",
      address: "Av Boyacá No. 15 - 98, Lc 1 -102 y 2 - 116",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Floridablanca",
      address: "Anillo vial km 2.5 Girón, Bucaramanga",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Ipiales 20 de Julio",
      address: "Cr 5A No. 8-36, Parque 20 de Julio",
      scheduleToday: "hoy de 08:00 a. m. - 8:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 8:00 p. m.",
        "Martes: 08:00 a. m. - 8:00 p. m.",
        "Miércoles: 08:00 a. m. - 8:00 p. m.",
        "Jueves: 08:00 a. m. - 8:00 p. m.",
        "Viernes: 08:00 a. m. - 8:00 p. m.",
        "Sábado: 07:00 a. m. - 8:00 p. m.",
        "Domingo: 07:00 a. m. - 8:00 p. m.",
      ]
    },
    {
      name: "Alkosto Ipiales Gran Plaza",
      address: "Cl 25 No. 6B–23, C.C Gran Plaza",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Mosquera",
      address: "Calle 3 #14a-16",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 08:00 a. m. - 9:00 p. m.",
        "Martes: 08:00 a. m. - 9:00 p. m.",
        "Miércoles: 08:00 a. m. - 9:00 p. m.",
        "Jueves: 08:00 a. m. - 9:00 p. m.",
        "Viernes: 08:00 a. m. - 9:00 p. m.",
        "Sábado: 07:00 a. m. - 9:00 p. m.",
        "Domingo: 07:00 a. m. - 9:00 p. m.",
      ]
    },
    {
      name: "Alkosto Outlet - Bodega de remates",
      address: "Ac. 45A Sur No. 51 - 90",
      scheduleToday: "hoy de 10:00 a. m. - 7:00 p. m.",
      schedule: [
        "Lunes: 10:00 a.m. - 8:00 p.m.",
        "Martes: 10:00 a.m. - 8:00 p.m.",
        "Miércoles: 10:00 a.m. - 8:00 p.m.",
        "Jueves: 10:00 a.m. - 8:00 p.m.",
        "Viernes: 10:00 a.m. - 8:00 p.m.",
        "Sábado: 10:00 a.m. - 8:00 p.m.",
        "Domingo: 10:00 a.m. - 6:00 p.m.",
      ]
    },
    {
      name: "Alkosto Avenida 68",
      address: "Av Cr 68 No. 72 - 43, Bogotá",
      scheduleToday: "hoy de 08:00 a. m. - 9:00 p. m.",
      schedule: [
        "Lunes: 10:00 a.m. - 8:00 p.m.",
        "Martes: 10:00 a.m. - 8:00 p.m.",
        "Miércoles: 10:00 a.m. - 8:00 p.m.",
        "Jueves: 10:00 a.m. - 8:00 p.m.",
        "Viernes: 10:00 a.m. - 8:00 p.m.",
        "Sábado: 10:00 a.m. - 8:00 p.m.",
        "Domingo: 10:00 a.m. - 6:00 p.m.",
      ]
    },

  ];
}
