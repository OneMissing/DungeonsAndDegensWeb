"use client";
import { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabase/client";

const MapCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState<any>(null); // Store map data (JSON or image)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [user, setUser] = useState<any>(null); // Store user session

  // Function to get the user session
  const getUserSession = async () => {
    const { data, error } = await supabase.auth.getUser();
    return data?.user || null;
  };

  useEffect(() => {
    const fetchUserAndMap = async () => {
      const userSession = await getUserSession();
      setUser(userSession);

      if (userSession) {
        // Fetch the user's last saved map
        const { data, error } = await supabase
          .from("maps")
          .select("map_data")
          .eq("user_id", userSession.id)
          .limit(1)
          .single();

        if (data && !error) {
          setMapData(data.map_data);
          drawMap(data.map_data);
        }
      }
    };

    fetchUserAndMap();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to initialize the map (can be a simple grid or previous saved map data)
  const drawMap = (map: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (map) {
      const tiles = map.tiles || [];
      tiles.forEach((tile: any) => {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.x, tile.y, 50, 50);
      });
    }
  };

  // Save the current canvas as a map and store it in Supabase
  const saveMap = async () => {
    setLoading(true);

    if (!user || !canvasRef.current) {
      console.error("User not found or canvas not available");
      setLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Capture the current map data (JSON or image)
      const mapData = {
        tiles: [] as any[], // Example: Create a basic tile structure for the map
      };

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // You can convert the canvas to an image and store as Base64 or JSON
      // Here, we store the map as tiles with colors
      for (let y = 0; y < canvas.height; y += 50) {
        for (let x = 0; x < canvas.width; x += 50) {
          const color = `#${imageData.data[(y * canvas.width + x) * 4].toString(16)}`;
          mapData.tiles.push({ x, y, color });
        }
      }

      // Save the map data to Supabase
      const { error } = await supabase.from("maps").upsert([
        {
          user_id: user.id,
          map_data: mapData,
        },
      ]);

      if (error) {
        console.error("Error saving map:", error);
      } else {
        alert("Map saved successfully!");
      }
    }

    setLoading(false);
  };

  // Example: Basic drawing functionality (click to add tiles)
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = "blue"; // Example: Blue tile
    ctx.fillRect(x - (x % 50), y - (y % 50), 50, 50); // Snap to grid
  };

  return (
    <div>
      <h1>Create or Edit Your Map</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
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
