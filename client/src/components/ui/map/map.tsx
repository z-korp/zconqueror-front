import React from "react";
import carte from "../../../../public/carte.png";
import Region from "./region";

interface MapProps {
  handleRegionClick: (region: string) => void;
}

const Map: React.FC<MapProps> = ({ handleRegionClick }: MapProps) => {
  return (
    <div className="relative w-full h-[500px]">
      <img
        src={carte}
        alt="Carte"
        className="w-full h-full absolute top-0 left-0"
      />
      <svg
        viewBox="0 0 3669 1932" // Ajustez cette valeur en fonction de vos coordonnées
        preserveAspectRatio="none"
        className="w-full h-full absolute top-0 left-0"
      >
        <Region
          d="M1061,854 1025,909 1009,948 993,994 938,1032 869,1049 808,1032 597,942 513,938 519,835 597,815 549,799 529,725 558,663 600,647 636,618 694,585 730,536 795,543 869,595 1054,815"
          fill="blue"
          fillOpacity={0.7}
          region="Rage1"
          troups={1}
        />
        <Region
          d="M616,955 788,1027 775,1056 727,1059 714,1075 723,1104 723,1134 697,1159 710,1192 733,1202 743,1231 727,1257 746,1260 736,1292 733,1318 694,1364 662,1386 636,1422 607,1406 548,1396 532,1351 474,1347 454,1347 422,1334 373,1328 331,1325 315,1286 341,1240 509,1270 554,1136"
          fill="green"
          fillOpacity={0.7}
          region="Rage2"
          troups={5}
        />
        <Region
          d="M613,951 509,1265 338,1236 295,1181 308,1145 318,1110 312,1084 493,951 516,931"
          fill="red"
          fillOpacity={0.7}
          region="Rage3"
          troups={10}
        />
      </svg>
    </div>
  );
};
export default Map;
