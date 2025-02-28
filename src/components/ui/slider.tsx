"use client";
import React, { useState } from "react";

interface SliderProps {
	min: number;
	max: number;
	value: number;
	onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, value, onChange }) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Math.round(parseFloat(event.target.value));
		onChange(newValue);
	};

	return (
		<div className="w-full">
			<input
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={handleChange}
				className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
		</div>
	);
};

export default Slider;