import * as React from "react";

import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { LensflarePlugin } from "photo-sphere-viewer-lensflare-plugin";

export const Images360 = ({ src }: { src: string }) => {
  const [validSrc, setValidSrc] = React.useState<string>("");
  const photoSphereRef = React.useRef<any>(null);

  const handleReady = (instance: any) => {
    const markersPlugs = instance.getPlugin(MarkersPlugin);
    if (!markersPlugs) return;
    markersPlugs.addEventListener("select-marker", () => {});
  };

  const plugins: [any, any][] = [
    [
      MarkersPlugin,
      {
        markers: [
          { id: "image", position: { yaw: "95deg", pitch: "16deg" }, image: "/pin-red.png", anchor: "bottom center", size: { width: 32, height: 32 }, tooltip: "Monte Civetta, Dolomites, Italy" },
        ],
      },
    ],
    [LensflarePlugin, { lensflares: [{ id: "sun", position: { yaw: "145deg", pitch: "2deg" }, type: 0 }] }],
  ];

  React.useEffect(() => {
    if (src) {
      setValidSrc(src);
    }
  }, []);

  return (
    <div className="w-full">
      <ReactPhotoSphereViewer
        ref={photoSphereRef}
        src={validSrc}
        littlePlanet={true}
        hideNavbarButton={true}
        height={"192"}
        width={"300"}
        containerClass="!w-full !rounded !overflow-hidden"
        onReady={handleReady}
        plugins={plugins}
      />
    </div>
  );
};
