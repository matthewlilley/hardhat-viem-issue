import { expect } from "chai";
import { network } from "hardhat";
import { createPublicClient, custom } from "viem";
import { hardhat } from "viem/chains";

export const tickLensContract = {
	address: "0xbfd8137f7d1516d3ea5ca83523914859ec47f573",
	abi: [
		{
			inputs: [
				{ internalType: "address", name: "pool", type: "address" },
				{ internalType: "int16", name: "tickBitmapIndex", type: "int16" },
			],
			name: "getPopulatedTicksInWord",
			outputs: [
				{
					components: [
						{ internalType: "int24", name: "tick", type: "int24" },
						{ internalType: "int128", name: "liquidityNet", type: "int128" },
						{
							internalType: "uint128",
							name: "liquidityGross",
							type: "uint128",
						},
					],
					internalType: "struct ITickLens.PopulatedTick[]",
					name: "populatedTicks",
					type: "tuple[]",
				},
			],
			stateMutability: "view",
			type: "function",
		},
	],
	functionName: "getPopulatedTicksInWord",
} as const;

describe("Reproduction", function () {
	it("Should", async function () {
		const client = createPublicClient({
			chain: {
				...hardhat,
				contracts: {
					multicall3: {
						address: "0xca11bde05977b3631167028862be2a173976ca11",
						blockCreated: 25770160,
					},
				},
				pollingInterval: 1_000,
			},
			transport: custom(network.provider),
		});

		const pools = [
			"0x0a6c4588b7D8Bd22cF120283B1FFf953420c45F3",
			"0xA374094527e1673A86dE625aa59517c5dE346d32",
			"0x88f3C15523544835fF6c738DDb30995339AD57d6",
			"0x67e708986a809aCefDe16f2417FA5701241E3935",
		] as const;

		const tickIndexes = [
			["-1092", "-1091", "-1090", "-1089", "-1088", "-1087", "-1086", "-1085"],
			["-113", "-112", "-111", "-110", "-109", "-108", "-107", "-106", "-105"],
			["-23", "-22", "-21", "-20", "-19", "-18", "-17", "-16", "-15"],
			["-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2"],
		] as const;

		const contracts = tickIndexes
			.map((indexes, i) =>
				indexes.map(
					(index) =>
						({
							...tickLensContract,
							args: [pools[i], index],
						}) as const,
				),
			)
			.flat();

		console.log({ contracts });

		const tickResults = await client.multicall({
			contracts,
		});

		expect(true).to.equal(true);
	});
});
