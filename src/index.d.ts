import * as React from 'react';
import { Scene, Camera, WebGLRenderer, Object3D, Material } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ConfigOptions, GlobeInstance as GlobeKapsuleInstance } from 'globe.gl';

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type ObjAccessor<T, In extends object = object> = Accessor<In, T>;
type HexBinAccessor<T> = Accessor<HexBin, T>;

type ArcDataType = GlobeProps['arcsData'][number];
type CustomLayerDataType = GlobeProps['customLayerData'][number];
type HexBinPointDataType = GlobeProps['hexBinPointsData'][number];
type HexPolygonDataType = GlobeProps['hexPolygonsData'][number];
type LabelDataType = GlobeProps['labelsData'][number];
type PointDataType = GlobeProps['pointsData'][number];
type PolygonDataType = GlobeProps['polygonsData'][number];
type TileDataType = GlobeProps['tilesData'][number];

interface HexBin {
  points: PointDataType[];
  sumWeight: number;
  center: { lat: number; lng: number };
}

interface GeoJsonGeometry {
  type: string;
  coordinates: number[];
}

interface TypeFace {}

type LabelOrientation = 'right' | 'top' | 'bottom';

interface GeoCoords {
  lat: number;
  lng: number;
  altitude: number;
}

interface CartesianCoords {
  x: number;
  y: number;
  z: number;
}

interface ScreenCoords {
  x: number;
  y: number;
}

export interface GlobeProps extends ConfigOptions {
  // Container layout
  width?: number;
  height?: number;
  backgroundColor?: string;
  backgroundImageUrl?: string | null;

  // Globe layer
  globeImageUrl?: string | null;
  bumpImageUrl?: string | null;
  showGlobe?: boolean;
  showGraticules?: boolean;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  globeMaterial?: Material;
  onGlobeReady?: () => void;
  onGlobeClick?: (coords: { lat; lng }, event: MouseEvent) => void;
  onGlobeRightClick?: (coords: { lat; lng }, event: MouseEvent) => void;

  // Points layer
  pointsData?: object[];
  pointLat?: ObjAccessor<number, PointDataType>;
  pointLng?: ObjAccessor<number, PointDataType>;
  pointColor?: ObjAccessor<string, PointDataType>;
  pointAltitude?: ObjAccessor<number, PointDataType>;
  pointRadius?: ObjAccessor<number, PointDataType>;
  pointResolution?: number;
  pointsMerge?: boolean;
  pointsTransitionDuration?: number;
  pointLabel?: ObjAccessor<string, PointDataType>;
  onPointClick?: (point: PointDataType, event: MouseEvent) => void;
  onPointRightClick?: (point: PointDataType, event: MouseEvent) => void;
  onPointHover?: (point: PointDataType | null, prevPoint: PointDataType | null) => void;

  // Arcs layer
  arcsData?: object[];
  arcStartLat?: ObjAccessor<number, ArcDataType>;
  arcStartLng?: ObjAccessor<number, ArcDataType>;
  arcEndLat?: ObjAccessor<number, ArcDataType>;
  arcEndLng?: ObjAccessor<number, ArcDataType>;
  arcColor?: ObjAccessor<string | string[], ArcDataType>;
  arcAltitude?: ObjAccessor<number | null, ArcDataType>;
  arcAltitudeAutoScale?: ObjAccessor<number, ArcDataType>;
  arcStroke?: ObjAccessor<number | null, ArcDataType>;
  arcCurveResolution?: number;
  arcCircularResolution?: number;
  arcDashLength?: ObjAccessor<number, ArcDataType>;
  arcDashGap?: ObjAccessor<number, ArcDataType>;
  arcDashInitialGap?: ObjAccessor<number, ArcDataType>;
  arcDashAnimateTime?: ObjAccessor<number, ArcDataType>;
  arcsTransitionDuration?: number;
  arcLabel?: ObjAccessor<string, ArcDataType>;
  onArcClick?: (arc: ArcDataType, event: MouseEvent) => void;
  onArcRightClick?: (arc: ArcDataType, event: MouseEvent) => void;
  onArcHover?: (arc: ArcDataType | null, prevArc: ArcDataType | null) => void;

  // Polygons layer
  polygonsData?: object[];
  polygonGeoJsonGeometry?: ObjAccessor<GeoJsonGeometry, PolygonDataType>;
  polygonCapColor?: ObjAccessor<string, PolygonDataType>;
  polygonCapMaterial?: ObjAccessor<Material, PolygonDataType>;
  polygonSideColor?: ObjAccessor<string, PolygonDataType>;
  polygonSideMaterial?: ObjAccessor<Material, PolygonDataType>;
  polygonStrokeColor?: ObjAccessor<string | boolean | null, PolygonDataType>;
  polygonAltitude?: ObjAccessor<number, PolygonDataType>;
  polygonCapCurvatureResolution?: ObjAccessor<number, PolygonDataType>;
  polygonsTransitionDuration?: number;
  polygonLabel?: ObjAccessor<string, PolygonDataType>;
  onPolygonClick?: (polygon: PolygonDataType, event: MouseEvent) => void;
  onPolygonRightClick?: (polygon: PolygonDataType, event: MouseEvent) => void;
  onPolygonHover?: (polygon: PolygonDataType | null, prevPolygon: PolygonDataType | null) => void;

  // Paths layer
  pathsData?: object[];
  pathPoints?: ObjAccessor<any[]>;
  pathPointLat?: Accessor<any, number>;
  pathPointLng?: Accessor<any, number>;
  pathPointAlt?: Accessor<any, number>;
  pathResolution?: number;
  pathColor?: ObjAccessor<string | string[]>;
  pathStroke?: ObjAccessor<number | null>;
  pathDashLength?: ObjAccessor<number>;
  pathDashGap?: ObjAccessor<number>;
  pathDashInitialGap?: ObjAccessor<number>;
  pathDashAnimateTime?: ObjAccessor<number>;
  pathTransitionDuration?: number;
  pathLabel?: ObjAccessor<string>;
  onPathClick?: (path: object, event: MouseEvent) => void;
  onPathRightClick?: (path: object, event: MouseEvent) => void;
  onPathHover?: (path: object | null, prevPath: object | null) => void;

  // Hex Bin layer
  hexBinPointsData?: HexBin[];
  hexBinPointLat?: ObjAccessor<number, HexBinPointDataType>;
  hexBinPointLng?: ObjAccessor<number, HexBinPointDataType>;
  hexBinPointWeight?: ObjAccessor<number, HexBinPointDataType>;
  hexBinResolution?: number;
  hexMargin?: HexBinAccessor<number>;
  hexAltitude?: HexBinAccessor<number>;
  hexTopCurvatureResolution?: number;
  hexTopColor?: HexBinAccessor<string>;
  hexSideColor?: HexBinAccessor<string>;
  hexBinMerge?: boolean;
  hexTransitionDuration?: number;
  hexLabel?: HexBinAccessor<string>;
  onHexClick?: (hex: HexBin, event: MouseEvent) => void;
  onHexRightClick?: (hex: HexBin, event: MouseEvent) => void;
  onHexHover?: (hex: HexBin | null, prevHex: HexBin | null) => void;

  // Hexed Polygons layer
  hexPolygonsData?: object[];
  hexPolygonGeoJsonGeometry?: ObjAccessor<GeoJsonGeometry, HexPolygonDataType>;
  hexPolygonColor?: ObjAccessor<string, HexPolygonDataType>;
  hexPolygonAltitude?: ObjAccessor<number, HexPolygonDataType>;
  hexPolygonResolution?: ObjAccessor<number, HexPolygonDataType>;
  hexPolygonMargin?: ObjAccessor<number, HexPolygonDataType>;
  hexPolygonCurvatureResolution?: ObjAccessor<number, HexPolygonDataType>;
  hexPolygonsTransitionDuration?: number;
  hexPolygonLabel?: ObjAccessor<string, HexPolygonDataType>;
  onHexPolygonClick?: (polygon: HexPolygonDataType, event: MouseEvent) => void;
  onHexPolygonRightClick?: (polygon: HexPolygonDataType, event: MouseEvent) => void;
  onHexPolygonHover?: (
    polygon: HexPolygonDataType | null,
    prevPolygon: HexPolygonDataType | null
  ) => void;

  // Tiles layer
  tilesData?: object[];
  tileLat?: ObjAccessor<number, TileDataType>;
  tileLng?: ObjAccessor<number, TileDataType>;
  tileAltitude?: ObjAccessor<number, TileDataType>;
  tileWidth?: ObjAccessor<number, TileDataType>;
  tileHeight?: ObjAccessor<number, TileDataType>;
  tileUseGlobeProjection?: ObjAccessor<boolean, TileDataType>;
  tileMaterial?: ObjAccessor<Material, TileDataType>;
  tileCurvatureResolution?: ObjAccessor<number, TileDataType>;
  tilesTransitionDuration?: number;
  tileLabel?: ObjAccessor<string, TileDataType>;
  onTileClick?: (tile: TileDataType, event: MouseEvent) => void;
  onTileRightClick?: (tile: TileDataType, event: MouseEvent) => void;
  onTileHover?: (tile: TileDataType | null, prevTile: TileDataType | null) => void;

  // Labels layer
  labelsData?: object[];
  labelLat?: ObjAccessor<number, LabelDataType>;
  labelLng?: ObjAccessor<number, LabelDataType>;
  labelText?: ObjAccessor<string, LabelDataType>;
  labelColor?: ObjAccessor<string, LabelDataType>;
  labelAltitude?: ObjAccessor<number, LabelDataType>;
  labelSize?: ObjAccessor<number, LabelDataType>;
  labelTypeFace?: TypeFace;
  labelRotation?: ObjAccessor<number, LabelDataType>;
  labelResolution?: number;
  labelIncludeDot?: ObjAccessor<boolean, LabelDataType>;
  labelDotRadius?: ObjAccessor<number, LabelDataType>;
  labelDotOrientation?: ObjAccessor<LabelOrientation, LabelDataType>;
  labelsTransitionDuration?: number;
  labelLabel?: ObjAccessor<string, LabelDataType>;
  onLabelClick?: (label: LabelDataType, event: MouseEvent) => void;
  onLabelRightClick?: (label: LabelDataType, event: MouseEvent) => void;
  onLabelHover?: (label: LabelDataType | null, prevLabel: LabelDataType | null) => void;

  // Custom layer
  customLayerData?: object[];
  customThreeObject?:
    | Object3D
    | string
    | ((d: CustomLayerDataType, globeRadius: number) => Object3D);
  customThreeObjectUpdate?:
    | string
    | ((obj: Object3D, objData: CustomLayerDataType, globeRadius: number) => void);
  customLayerLabel?: ObjAccessor<string, CustomLayerDataType>;
  onCustomLayerClick?: (obj: CustomLayerDataType, event: MouseEvent) => void;
  onCustomLayerRightClick?: (obj: CustomLayerDataType, event: MouseEvent) => void;
  onCustomLayerHover?: (
    obj: CustomLayerDataType | null,
    prevObj: CustomLayerDataType | null
  ) => void;

  // Render control
  enablePointerInteraction?: boolean;
  pointerEventsFilter?: (object: Object3D, data?: object) => boolean;
  lineHoverPrecision?: number;
  onZoom?: (pov: GeoCoords) => void;
}

export interface GlobeMethods {
  // Render control
  pointOfView(): GeoCoords;
  pointOfView(
    pov: { lat?: number; lng?: number; altitude?: number },
    transitionMs?: number
  ): GlobeKapsuleInstance;
  pauseAnimation(): GlobeKapsuleInstance;
  resumeAnimation(): GlobeKapsuleInstance;
  scene(): Scene;
  camera(): Camera;
  renderer(): WebGLRenderer;
  postProcessingComposer(): EffectComposer;
  controls(): object;

  // Utilities
  getCoords(lat: number, lng: number, altitude?: number): CartesianCoords;
  getScreenCoords(lat: number, lng: number, altitude?: number): ScreenCoords;
  toGeoCoords(coords: CartesianCoords): GeoCoords;
  toGlobeCoords(x: number, y: number): { lat: number; lng: number } | null;
}

type FCwithRef<P = {}, R = {}> = React.FunctionComponent<
  P & { ref?: React.MutableRefObject<R | undefined> }
>;

declare const Globe: FCwithRef<GlobeProps, GlobeMethods>;

export default Globe;
