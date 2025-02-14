"use client";
import { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabase/client";

const TILE_SIZE = 50;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const MapCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [user, setUser] = useState<any>(null);

  const getUserSession = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  };

  useEffect(() => {
    const fetchUserAndMap = async () => {
      const userSession = await getUserSession();
      setUser(userSession);

      if (userSession) {
        const { data } = await supabase
          .from("maps")
          .select("map_data")
          .eq("user_id", userSession.id)
          .limit(1)
          .single();

        if (data) {
          setMapData(data.map_data);
          drawMap(data.map_data);
        }
      }
    };
    fetchUserAndMap();
  }, []);

  const drawMap = (map: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);

    if (map?.tiles) {
      map.tiles.forEach((tile: any) => {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
      });
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  };

  const saveMap = async () => {
    setLoading(true);
    if (!user || !canvasRef.current) return;

    const mapData = { tiles: [] as any[] };
    for (let y = 0; y < CANVAS_HEIGHT; y += TILE_SIZE) {
      for (let x = 0; x < CANVAS_WIDTH; x += TILE_SIZE) {
        mapData.tiles.push({ x, y, color: "#ffffff" });
      }
    }

    await supabase.from("maps").upsert([{ user_id: user.id, map_data: mapData }]);
    setLoading(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const snappedX = x - (x % TILE_SIZE);
    const snappedY = y - (y % TILE_SIZE);

    ctx.fillStyle = "blue";
    ctx.fillRect(snappedX, snappedY, TILE_SIZE, TILE_SIZE);
  };

  return (
    <div>
      <h1>Create or Edit Your Map</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid black" }}
        onClick={handleCanvasClick}
      />
      <br />
      <button onClick={saveMap} disabled={loading}>
        {loading ? "Saving..." : "Save Map"}
      </button>
    </div>
  );
};

export default MapCreatePage;
