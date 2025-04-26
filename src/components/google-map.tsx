import * as React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "900px",
  height: "300px",
};

const Google = ({ lat = -8.7225847, lng = 115.1694985 }: { lat: number; lng: number }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_URL,
  });

  const [_, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds({ lat, lng });
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={{ lat, lng }} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
      <div>{}</div>
    </GoogleMap>
  ) : (
    <></>
  );
};

export const GoogleMaps = React.memo(Google);
