"use client";

import { useState } from "react";
import { Character, Classes, Races } from "@/lib/tools/types";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const CharacterInfo = ({ character, setCharacter, className }: { character?: Character; setCharacter: (character: Character) => void; className?: string }) => {
	if (character === undefined) return;
	const [editingField, setEditingField] = useState<keyof Character | null>(null);
	const [fieldValue, setFieldValue] = useState<string>("");
	const [isInvalid, setIsInvalid] = useState(false);

	const handleDoubleClick = (field: keyof Character) => {
		setFieldValue(character[field]?.toString() ?? "");
		setEditingField(field);
		setIsInvalid(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFieldValue(e.target.value);
	};

	const handleBlur = async () => {
		if (!editingField) return;
		let updatedValue: any = fieldValue.toLowerCase();
		if (!isNaN(Number(fieldValue))) updatedValue = Number(fieldValue);
		const updatedCharacter = { ...character, [editingField]: updatedValue };
		const { error } = await supabase.from("characters").update({ [editingField]: updatedValue }).eq("character_id", character.character_id);
		if (error) 
			console.error("Error updating Supabase:", error);
		else 
			setCharacter(updatedCharacter);
		setEditingField(null);
	};

	const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
			e.preventDefault();
		}
	};

	return (
		<div className={`${className}`}>
			<h2 className="text-4xl font-bold text-center" onDoubleClick={() => handleDoubleClick("name")}>
				{editingField === "name" ? (
					<input
						type="text"
						value={fieldValue}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`w-full text-center ${isInvalid ? "border-red-500" : ""}`}
						autoFocus
					/>
				) : (
					character.name
				)}
			</h2>
			<div className="text-lg text-center">
				<span onDoubleClick={() => handleDoubleClick("race")} className="inline-block w-20 text-center">
					{editingField === "race" ? (
						<div>
							<input
								type="text"
								value={fieldValue.slice(0,1).toUpperCase() + fieldValue.slice(1).toLowerCase()}
								onChange={handleChange}
								list="race-options"
								onBlur={handleBlur}
								className={`w-full text-center ${isInvalid ? "border-red-500" : ""}`}
								autoFocus
							/>
							<datalist id='race-options'>
                                {Object.values(Races).map((raceOption) => (
                                    <option key={raceOption} value={raceOption.slice(0,1).toUpperCase() + raceOption.slice(1).toLowerCase()} />
                                ))}
                            </datalist>
						</div>
					) : (
						character.race.slice(0,1).toUpperCase() + character.race.slice(1).toLowerCase()
					)}
				</span>
				{" - "}
				<span onDoubleClick={() => handleDoubleClick("class")} className="inline-block w-20 text-center">
					{editingField === "class" ? (
						<div>
							<input
								type="text"
								value={fieldValue.slice(0,1).toUpperCase() + fieldValue.slice(1).toLowerCase()}
								onChange={handleChange}
								list="class-options"
								onBlur={handleBlur}
								className={`w-full text-center ${isInvalid ? "border-red-500" : ""}`}
								autoFocus
							/>
							<datalist id='class-options'>
                                {Object.values(Classes).map((classOption) => (
                                    <option key={classOption} value={classOption.slice(0,1).toUpperCase() + classOption.slice(1).toLowerCase()} />
                                ))}
                            </datalist>
						</div>
					) : (
						character.class.slice(0,1).toUpperCase() + character.class.slice(1).toLowerCase()
					)}
				</span>
				{" (Level "}
				{character.level}
				{")"}
			</div>
			<div className="text-center">
				<p>
					HP:
					<span onDoubleClick={() => handleDoubleClick("hpnow")} className="inline-block w-12 text-center">
						{editingField === "hpnow" ? (
							<input
								type="text"
								pattern="[0-9]*"
								value={fieldValue}
								onChange={handleChange}
								onKeyDown={handleNumberKeyDown}
								onBlur={handleBlur}
								className="w-full text-center appearance-none"
								autoFocus
							/>
						) : (
							character.hpnow
						)}
					</span>{" "}
					/
					<span onDoubleClick={() => handleDoubleClick("hpmax")} className="inline-block w-12 text-center appearance-none">
						{editingField === "hpmax" ? (
							<input
								type="text"
								pattern="[0-9]*"
								value={fieldValue}
								onChange={handleChange}
								onKeyDown={handleNumberKeyDown}
								onBlur={handleBlur}
								className="w-full text-center appearance-none"
								autoFocus
							/>
						) : (
							character.hpmax
						)}
					</span>{" "}
					+
					<span onDoubleClick={() => handleDoubleClick("hptmp")} className="inline-block w-12 text-center appearance-none">
						{editingField === "hptmp" ? (
							<input
								type="text"
								pattern="[0-9]*"
								value={fieldValue}
								onChange={handleChange}
								onKeyDown={handleNumberKeyDown}
								onBlur={handleBlur}
								className="w-full text-center appearance-none"
								autoFocus
							/>
						) : (
							character.hptmp
						)}
					</span>
				</p>
			</div>
			<h3 className="text-2xl font-semibold">Attributes</h3>
			<ul className="grid grid-cols-2 gap-4 text-gray-700">
				{(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as (keyof Character)[]).map((attr) => (
					<li key={attr} onDoubleClick={() => handleDoubleClick(attr)}>
						<strong>{attr.toUpperCase().slice(0, 3)}:</strong>{" "}
						{editingField === attr ? (
							<input
								type="text"
								pattern="[0-9]*"
								value={fieldValue}
								onChange={handleChange}
								onKeyDown={handleNumberKeyDown}
								onBlur={handleBlur}
								className="w-8 appearance-none"
								autoFocus
							/>
						) : (
							character[attr] ?? "N/A"
						)}
					</li>
				))}
			</ul>
			{/* Dice Button */}
			<button 
    		className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition"		
			onClick={() => window.open("/")}
			>
    		Roll Dice
			</button>
		</div>
	);
};

export default CharacterInfo;
