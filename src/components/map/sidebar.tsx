"use client";

import React, { useEffect, useRef, useState } from "react";
import { default as NextImage } from "next/image";
import { Character, Structure, tileCategories, SidebarProps } from "@/lib/tools/map";
import { PopupSave, PopupLoad } from "./mapPopups";
import { Boxes, House, MousePointerClick, Move, Settings, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { structureData } from "@/lib/tools/map";
import Sidebar from "../ui/sidebar";
import { Divider } from "@heroui/react";


const MapSidebar: React.FC<SidebarProps> = ({
	activeTab,
	setActiveTab,
	tileColors,
	activeTile,
	setActiveTile,
	champions,
	addCharacter,
	addItem,
	saveCanvas,
	loadCanvas,
	characters,
	setCharacters,
	structures,
	setStructures,
	tiles,
	setTiles,
	selectionMode,
	setSelectionMode,
}) => {
	const isResizingRef = useRef(false);
	const [sidebarWidth, setSidebarWidth] = useState(300);
	const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
	const [isLoadPopupOpen, setIsLoadPopupOpen] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const imageSize = sidebarWidth <= 250 ? 50 : sidebarWidth >= 400 ? 100 : 75;
	const columns = sidebarWidth >= 400 ? 3 : 2;
	const [structureImages, setStructureImages] = useState<{ name: string; url: string; width: number; height: number }[]>([]);
	const supabase = createClient();

	useEffect(() => {
		setStructureImages(
			structureData.map((structure) => ({
				name: structure.name,
				url: structure.image_path || "",
				width: structure.width ?? 50,
				height: structure.height ?? 50,
			}))
		);
	}, []);

	useEffect(() => {
		const savedWidth = localStorage.getItem("sidebarWidth");
		if (savedWidth) {
			setSidebarWidth(parseInt(savedWidth, 10));
		}
	}, []);

	const startResizing = (e: React.MouseEvent) => {
		e.preventDefault();
		isResizingRef.current = true;
		setIsTransitioning(false);

		const startX = e.clientX;
		const startWidth = sidebarWidth;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			if (!isResizingRef.current) return;
			const newWidth = Math.min(430, Math.max(225, startWidth + moveEvent.clientX - startX));
			setSidebarWidth(newWidth);
			localStorage.setItem("sidebarWidth", newWidth.toString());
		};

		const handleMouseUp = () => {
			isResizingRef.current = false;
			setIsTransitioning(true); // Enable transition for smooth ease-out effect
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<Sidebar
			open={true}
			width={`${sidebarWidth}px`}
			className={`relative bg-1-light dark:bg-1-dark border-r border-border-light dark:border-border-dark duration-100 ease-in-out transition-all ${
				isTransitioning ? "ease-out duration-300" : "duration-0"
			}`}>
			{isSavePopupOpen && <PopupSave mapData={{ structures, tiles, characters }} onClose={() => setIsSavePopupOpen(false)} />}
			<PopupLoad
				buildMap={(mapData) => {
					setStructures(mapData.structures);
					setTiles(mapData.tiles);
					setCharacters(
						mapData.characters.map((char: Character) => ({
							...char,
							class: char.class ? char.class.toLowerCase() : "fighter",
							imagePath: char.class ? `/characters/${char.class.toLowerCase()}.webp` : "/characters/fighter.webp",
						}))
					);
				}}
				isOpen={isLoadPopupOpen}
				setIsOpen={setIsLoadPopupOpen}
			/>

			<div className="absolute -top-4 right-0 w-2 h-full bg-gray-300 dark:bg-gray-700 z-[60] flex items-center justify-center cursor-ew-resize" onMouseDown={startResizing}>
				<div className="h-10 w-full bg-gray-500 dark:bg-gray-400 rounded-full"></div>
			</div>

			<div>
				<div className="flex space-x-2 mb-4 mr-2">
					{[
						{ tab: "tiles", icon: Square, label: "Tiles" },
						{ tab: "characters", icon: House, label: "Characters" },
						{ tab: "structures", icon: Boxes, label: "Structures" },
						{ tab: "settings", icon: Settings, label: "Settings" },
					].map(({ tab, icon: Icon, label }) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab as any)}
							className={`flex items-center p-2 rounded-md text-sm transition-all ease-out duration-300 ${sidebarWidth > 244 ? "w-full" : "w-auto"} ${
								activeTab === tab ? "bg-primary-light dark:bg-primary-dark text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
							}`}>
							<Icon className="w-5 h-5 flex-shrink-0 transition-all ease-out duration-300" />
							<span
								className={`ml-2 transition-opacity ease-out duration-300 absolute ${
									sidebarWidth > 270 && (activeTab === tab || sidebarWidth > 420) ? "opacity-100 relative" : "opacity-0"
								}`}>
								{label}
							</span>
						</button>
					))}
				</div>

				<div className="relative flex flex-col h-[100%-10rem] overflow-y-auto">
					{activeTab === "tiles" && (
						<div className="space-y-4">
							{Object.entries(tileCategories).map(([category, tiles]) => (
								<div key={category} className="">
									<h3 className="text-center text-lg capitalize pb-2">{category}</h3>
									<div className="flex flex-wrap gap-2">
										{Object.entries(tiles).map(([tile, src]) => (
											<button
												key={tile}
												className={`w-12 h-12 border rounded-md ${activeTile === tile ? "border-yellow-500" : "border-gray-600"}`}
												onClick={() => setActiveTile(tile)}>
												{src ? <img src={src} alt={tile} className="w-full h-full" /> : "🧽"}
											</button>
										))}
									</div>
									<Divider className="my-4 w-[calc(100%-0.5rem)]" />
								</div>
							))}
						</div>
					)}
					{activeTab === "characters" && (
						<div
							className="grid gap-2"
							style={{
								gridTemplateColumns: `repeat(${columns}, 1fr)`,
							}}>
							{champions.map((char) => (
								<button key={char.character_id} onClick={() => addCharacter(char)} className="p-2 border border-border-light dark:border-border-dark rounded-md">
									<NextImage
										alt={char.name}
										src={`/characters/${char.class.toLowerCase()}.webp`}
										className="w-full"
										width={imageSize}
										height={imageSize}
										draggable="false"
									/>
									<p className="text-center text-sm text-foreground-light dark:text-foreground-dark">{char.name}</p>
								</button>
							))}
						</div>
					)}
					{activeTab === "structures" && (
						<div
							className="grid gap-2"
							style={{
								gridTemplateColumns: `repeat(${columns}, 1fr)`,
							}}>
							{structureImages.map((structure) => (
								<button
									key={structure.name}
									onClick={() => addItem(structure.url, structure.width, structure.height)}
									className="p-2 border border-border-light dark:border-border-dark rounded-md">
									<NextImage src={structure.url} alt={structure.name} width={imageSize} height={imageSize} className="w-auto h-auto" draggable="false" />
									<p className="text-center text-sm text-foreground-light dark:text-foreground-dark">{structure.name.replace(/_/g, " ")}</p>
								</button>
							))}
						</div>
					)}
					{activeTab === "settings" && (
						<div className="space-y-2">
							<button onClick={() => setIsSavePopupOpen(true)} className="w-full p-2 bg-primary-light dark:bg-primary-dark text-white rounded-md">
								Save Map
							</button>
							<button onClick={() => setIsLoadPopupOpen(true)} className="w-full p-2 bg-secondary-light dark:bg-secondary-dark text-white rounded-md">
								Load Map
							</button>
						</div>
					)}
				</div>
			</div>

			{sidebarWidth > 50 && (
				<div className="absolute left-0 bottom-0 w-full bg-gray-300 dark:bg-2-dark overflow-hidden">
					<div className="p-4">
						<h1 className="text-center text-gray-300 text-sm font-semibold mb-2">Mode</h1>
						<div className="grid grid-cols-3 gap-2">
							{[
								{
									mode: "rectangle" as const,
									icon: Square,
									label: "Rectangle",
								},
								{
									mode: "single" as const,
									icon: MousePointerClick,
									label: "Single",
								},
								{
									mode: "structures" as const,
									icon: Move,
									label: "Structures",
								},
							].map(({ mode, icon: Icon, label }) => (
								<button
									key={mode}
									onClick={() => setSelectionMode(mode)}
									className={`flex flex-col items-center justify-center p-2 rounded-md transition-all ease-out duration-300
                        ${selectionMode === mode ? "bg-blue-500 text-white shadow-md shadow-blue-500/50" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
									<Icon className="w-5 h-5 mb-1" />
									<span className="text-xs">{label}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</Sidebar>
	);
};

export default MapSidebar;
