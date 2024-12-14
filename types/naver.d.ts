interface Window {
  naver: any;
}

export declare namespace naver {
  namespace maps {
    class Map {
      constructor(element: string | HTMLElement, options?: MapOptions);
      setCenter(location: LatLng): void;
      setZoom(level: number): void;
      getBounds(): LatLngBounds;
      getCenter(): LatLng;
      getZoom(): number;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(position: LatLng): void;
      getPosition(): LatLng;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw: LatLng, ne: LatLng);
      getCenter(): LatLng;
      getNE(): LatLng;
      getSW(): LatLng;
      extend(latlng: LatLng): this;
      hasLatLng(latlng: LatLng): boolean;
      toString(): string;
      union(bounds: LatLngBounds): LatLngBounds;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    class Event {
      static addListener(
        instance: any,
        eventName: string,
        handler: Function,
      ): void;
      static removeListener(
        instance: any,
        eventName: string,
        handler: Function,
      ): void;
    }

    interface MapOptions {
      center: LatLng;
      zoom?: number;
      minZoom?: number;
      maxZoom?: number;
      zoomControl?: boolean;
      zoomControlOptions?: {
        position: any;
        style: any;
      };
    }

    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      icon?: ImageIcon;
      title?: string;
      cursor?: string;
      clickable?: boolean;
      draggable?: boolean;
      visible?: boolean;
      zIndex?: number;
    }

    interface ImageIcon {
      url: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
    }
  }
}

declare global {
  interface Window {
    naver: typeof naver;
  }
}
