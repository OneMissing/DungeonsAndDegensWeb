"use client";

import { Character } from "@/lib/tools/types";
import { useEffect, useState } from "react";

const CharacterList: React.FC<{ character: Character | undefined }> = ({ character }) => {
	if (character === undefined) return <>Loading</>;
	return (
		<div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-3xl mx-auto">
			<h1 className="text-3xl font-bold mb-2">{character.name}</h1>
			<p className="text-lg">
				{character.race} {character.class} - Level {character.level}
			</p>
			<p className="text-sm text-gray-400">
				{character.alignment} | {character.background}
			</p>
			<hr className="my-4 border-gray-600" />

			<h2 className="text-xl font-semibold">Hit Points</h2>
			<p className="p-2 bg-gray-700 rounded">
				Current: {character.hpnow} / {character.hpmax} (Temp: {character.hptmp})
			</p>

			<h2 className="text-xl font-semibold">Attributes</h2>
			<div className="grid grid-cols-3 gap-2 my-2">
				{["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"].map((attr, index) => (
					<div key={index} className="p-2 bg-gray-700 rounded">
						<span className="font-semibold">{attr}:</span> {character[attr.toLowerCase() as keyof Character]}
					</div>
				))}
			</div>

			<h2 className="text-xl font-semibold">Spell Slots</h2>
			<div className="grid grid-cols-3 gap-2 my-2">
				{Array.from({ length: 9 }, (_, i) => `Spell Slot ${i + 1}`).map((slot, index) => (
					<div key={index} className="p-2 bg-gray-700 rounded">
						<span className="font-semibold">{slot}:</span> {character[`spell_slot_${index + 1}` as keyof Character]}
					</div>
				))}
			</div>
		</div>
	);
};

export default CharacterList;
