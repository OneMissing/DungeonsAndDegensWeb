// types/dice-box.d.ts
declare module '@3d-dice/dice-box-threejs' {
	export default class DiceBox {
	  constructor(config: {
		id: string;
		assetPath: string;
		scale?: number;
		theme?: string;
		themeColor?: string;
		throwForce?: number;
		sound?: boolean;
		lightIntensity?: number;
		spinForce?: number;
		startingHeight?: number;
		enableShadows?: boolean;
	  });
	  init(): Promise<void>;
	  roll(notation: string): Promise<{ dice: string; value: number }[]>;
	  destroy(): void;
	}
  }