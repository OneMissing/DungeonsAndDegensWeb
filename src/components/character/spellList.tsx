"use client";

import { Action, Spell } from "@/lib/tools/types";
import { Divider, Tooltip } from "@heroui/react";
import { count } from "console";
import { Anvil, Brain, Hand, Pentagon, Volume2 } from "lucide-react";
import { useState } from "react";

const SpellList: React.FC<{ character_id: string; spells: Spell[]; actions: Action[] }> = ({ character_id, spells, actions }) => {
	const [isTooltipVisible, setIsTooltipVisible] = useState(true);
	return (
		<div>
			<ul>
				{actions.map((action) => {
					const spell = spells.find((spell) => spell.spell_id === action.spell_id);
					return (
						<li key={action.action_id}>
							{spell && (
								<Tooltip
									offset={4}
									closeDelay={0}
									delay={0}
									placement="bottom"
									className="pointer-events-none transition-all duration-500 ease-in-out"
									onMouseEnter={() => setIsTooltipVisible(false)}
									content={
										isTooltipVisible && (
											<div className="backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 px-1 py-2 bg-2-light dark:bg-slate-700 border border-bg1-dark dark:border-bg1-light rounded-lg h-full select-none w-96">
												<div className="flex items-center justify-center overflow-hidden whitespace-nowrap">
													<p className="font-semibold">School: </p> {spell.school}
												</div>
												<div className="flex items-center justify-center overflow-hidden whitespace-nowrap">
													<p className="text-center font-semibold">Type: </p> {spell.level == 0 ? "canterip" : `${spell.level} spell`}
												</div>
												<div className="flex items-center justify-center overflow-hidden whitespace-nowrap">
													<p className="text-center font-semibold">Duration:</p> {spell.duration}
												</div>
												<div className="flex items-center justify-center overflow-hidden whitespace-nowrap">
													<p className="text-center font-semibold">Casting time:</p> {spell.casting_time}
												</div>
												<div className="flex items-center justify-center overflow-hidden whitespace-nowrap">
													<p className="text-center font-semibold">Description:</p> {spell.range}
												</div>
												<div className="flex w-full justify-center overflow-hidden whitespace-nowrap">
                                                {(spell.ritual || spell.concentration) && (
													<div className="flex justify-center w-1/2">
														<p className="text-strat font-semibold mr-3">Kind:</p>
														{spell.concentration && <Brain />} 
														{spell.ritual && <Pentagon />} 
													</div>)}
													<div className="flex justify-evenly w-1/2">
                                                    <p className="text-center font-semibold">Components:</p>
                                                    <div className="flex justify-start">
															{spell.components.includes("V") && <Volume2 />}
															{spell.components.includes("S") && <Hand />}
															{spell.components.includes("M") && <Anvil />}
														</div>
													</div>
												</div>
											</div>
										)
									}>
									<strong onMouseEnter={() => setIsTooltipVisible(true)} onClick={()=> {}}>{spell.name}</strong>
								</Tooltip>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default SpellList;
