"use client";
import { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabase/client";

const TILE_SIZE = 50;

const MapCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [user, setUser] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

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
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    drawGrid(ctx);
    
    if (map?.tiles) {
      map.tiles.forEach((tile: any) => {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
      });
    }
    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    for (let x = -10000; x <= 10000; x += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, -10000);
      ctx.lineTo(x, 10000);
      ctx.stroke();
    }
    for (let y = -10000; y <= 10000; y += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(-10000, y);
      ctx.lineTo(10000, y);
      ctx.stroke();
    }
  };

  const saveMap = async () => {
    setLoading(true);
    if (!user || !canvasRef.current) return;

    const mapData = { tiles: [] as any[] };
    for (let y = -10000; y < 10000; y += TILE_SIZE) {
      for (let x = -10000; x < 10000; x += TILE_SIZE) {
        mapData.tiles.push({ x, y, color: "#ffffff" });
      }
    }

    await supabase.from("maps").upsert([{ user_id: user.id, map_data: mapData }]);
    setLoading(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    const snappedX = Math.floor(x / TILE_SIZE) * TILE_SIZE;
    const snappedY = Math.floor(y / TILE_SIZE) * TILE_SIZE;

    ctx.fillStyle = "blue";
    ctx.fillRect(snappedX, snappedY, TILE_SIZE, TILE_SIZE);
  };

  const handleWheel = (e: React.WheelEvent) => {
    setScale((prev) => Math.max(0.1, prev * (e.deltaY < 0 ? 1.1 : 0.9)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      setOffset((prev) => ({
        x: prev.x + e.clientX - lastMousePos.current.x,
        y: prev.y + e.clientY - lastMousePos.current.y,
      }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute top-0 left-0 cursor-grab"
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default MapCreatePage;
