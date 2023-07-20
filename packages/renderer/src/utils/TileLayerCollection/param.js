import { getKeys } from '/@/utils/mapKey.js';


export default function getParams() {
  const { mapboxKey, tdtKey } = getKeys();

  const params = {
    TDT: {
      Normal: {
        url: 'http://t0.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=' + tdtKey,
      },
      Normal_Label: {
        url: 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=' + tdtKey,
      },
      Satellite: {
        url: 'http://t0.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=' + tdtKey,
      },
      Satellite_Label: {
        url: 'http://t0.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=' + tdtKey,
      },

      Terrain: {
        url: 'http://t0.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=' + tdtKey,
      },

      Terrain_Label: {
        url: 'http://t0.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk=' + tdtKey,
      },
    },
    GEOQ: {
      Colour: {
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
      },
      Gray: {
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
      },
      Midnightblue: {
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      },
    },
    Google: {
      Normal: {
        url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}',
      },
      Satellite: {
        url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
      },
      Satellite_Label: {
        url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=CN&x={x}&y={y}&z={z}',
      },

    },
    Amap: {
      Normal: {
        url: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      },
      Satellite: {
        url: 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      },
      Satellite_Label: {
        url: 'http://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
      },
      NormalEn: {
        url: 'http://webrd01.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      },
    },
    Tencent: {
      Normal: {
        url: 'http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0',
      },
      Satellite: {
        url: 'http://p0.map.gtimg.com/sateTiles/{z}/{m}/{n}/{x}_{y}.jpg',
      },
      Satellite_Label: {
        url: 'http://rt3.map.gtimg.com/tile?z={z}&x={x}&y={y}&type=vector&styleid=3&version=117',
      },
      Terrain: {
        url: 'http://p0.map.gtimg.com/demTiles/{z}/{m}/{n}/{x}_{y}.jpg',
      },
      Terrain_Label: {
        url: 'http://rt3.map.gtimg.com/tile?z={z}&x={x}&y={y}&type=vector&styleid=3&version=117',
      },
    },
    Osm: {
      Normal: {
        url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      },
      Bike: {
        url: 'https://c.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
      },
      Transport: {
        url: 'https://c.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
      },
      Humanitarian: {
        url: 'https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      },
    },
    CartoDb: {
      Dark: {
        url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      },
      Light: {
        url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      },
    },
    Mapbox: {
      Streets: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      Dark: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      LightDark: {
        url: 'http://a.tiles.mapbox.com/v3/spatialdev.map-c9z2cyef/{z}/{x}/{y}.png',
      },
      Satellite: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      Light: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      Emerald: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      White: {
        url: 'http://a.tiles.mapbox.com/v4/examples.map-h67hf2ic/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      Red: {
        url: 'http://a.tiles.mapbox.com/v4/examples.map-h68a1pf7,examples.npr-stations/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      Outdoors: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      StreetsSatellite: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      Comic: {
        url: 'http://a.tiles.mapbox.com/v4/mapbox.comic/{z}/{x}/{y}.png?access_token=' + mapboxKey,
      },
      Building: {
        url: 'https://b.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png',
      },
    },
    Baidu: {
      Normal: {
        // url: 'http://api0.map.bdimg.com/customimage/tile?&x=3&y=1&z=5&scale=1&customid=normal',
        url: 'https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927',
      },
      Satellite: {
        url: 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
      },
      midnight: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=midnight',
      },
      light: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=light',
      },
      dark: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=dark',
      },
      redalert: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=redalert',
      },
      googlelite: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=googlelite',
      },
      grassgreen: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=grassgreen',
      },
      pink: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=pink',
      },
      darkgreen: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=darkgreen',
      },
      bluish: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=bluish',
      },
      grayscale: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=grayscale',
      },
      hardedge: {
        url: 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=hardedge',
      },
    },
  };

  return params;
}

