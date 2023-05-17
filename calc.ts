// Stats
const baseRaw = 350;
const rawMultiplier = 1;
const flatAttack = 20 + 3;
const totalRawBuffs = 1; // Hunting horn buffs to here
const totalRaw = Math.floor(((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1);

const dragonConversion: 0 | 0.04 | 0.08 = 0.08; // None | DC1, DC2 | DC3 
const dragonConversionBuff: 0 | 50 | 75 = 75;

const fireRes = 19;
const waterRes = 27;
const thunderRes = 13;
const iceRes = 13;
const dragonRes = 2;

const dragonConversionElement = dragonConversionRound((fireRes + waterRes + thunderRes + iceRes + dragonRes + dragonConversionBuff) * dragonConversion);

const baseElement = 77;
const elementMultiplier = 1; // Multiplicative with each other
const flatElement = 0;
const totalElementBuffs = 1; // Hunting horn buffs go here
const totalElement = Math.floor(((baseElement * elementMultiplier) + flatElement + dragonConversionElement) * totalElementBuffs + 0.1);

let affinity = 0;
affinity = Math.min(1, affinity/100);

// Damage Calculations
const frostcraft: 1 | 1.05 | 1.2 | 1.25 = 1;

const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.35; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
const rawChargeLevel: 0.65 | 1 | 1.25 | 1.35 = 1.25;
const motionValue = 0.09;
const rawHitZone = 0.6;
const antiSpecies = 1; // Still need to work this one out
const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1;

const rawDamageNoCrit = monsterHunterRound(totalRaw * criticalRange * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp * frostcraft);
const rawDamageCrit = monsterHunterRound(totalRaw * criticalRange * (1 + (critDamage - 1)) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp * frostcraft);
const rawDamageAverage = monsterHunterRound(totalRaw * criticalRange * (1 + (affinity * (critDamage - 1))) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp * frostcraft);


const critElement: 1 | 1.05 | 1.1 | 1.15 = 1;
const elementChargeLevel: 0.8 | 1 | 1.1 | 1.2 = 1.1; // Based on charge level
const elementHitZone = 0.2;
const elementExploit = 1; // Elembane and Element Exploit are additive

const elementDamageNoCrit = monsterHunterRound(totalElement * elementChargeLevel * elementHitZone * elementExploit * frostcraft);
const elementDamageCrit = monsterHunterRound(totalElement * (1 + (critElement - 1)) * elementChargeLevel * elementHitZone * elementExploit * frostcraft);
const elementDamageAverage = monsterHunterRound(totalElement * (1 + (affinity * (critElement - 1))) * elementChargeLevel * elementHitZone * elementExploit * frostcraft);

const totalDamageNoCrit = rawDamageNoCrit + elementDamageNoCrit;
const totalDamageCrit = rawDamageCrit + elementDamageCrit;
const totalDamageAverage = rawDamageAverage + elementDamageAverage;

console.log(`Total Raw: ${totalRaw}`);
console.log(`Total Element: ${totalElement}`);

console.log(`Raw Damage: No Crit: ${rawDamageNoCrit} | Crit: ${rawDamageCrit} | Average ${rawDamageAverage}`);
console.log(`Elemental Damage: No Crit: ${elementDamageNoCrit} | Crit: ${elementDamageCrit} | Average ${elementDamageAverage}`);

console.log(`Total Damage: No Crit: ${totalDamageNoCrit} | Crit: ${totalDamageCrit} | Average ${totalDamageAverage}`);

function customRound(numberToRound: number, type: "none" | "ceiling" | "floor" | "normal" | "monster hunter") {
    if(type === "none") {
        return numberToRound;
    } else if (type === "ceiling") {
        return Math.ceil(numberToRound);
    } else if (type === "floor") {
        return Math.floor(numberToRound);
    } else if (type === "normal") {
        return Math.round(numberToRound);
    } else {
        return monsterHunterRound(numberToRound)
    }
}

function calculateStats (
    baseRaw: number,
    rawMultiplier: number,
    flatAttack: number,
    totalRawBuffs: number,
    affinity: number,
    baseElement: number,
    elementMultiplier: number,
    flatElement: number,
    totalElementBuffs: number,
    roundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter"
) {
    return {
        "Raw": customRound((((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1), roundType),
        "Element": customRound((((baseElement * elementMultiplier) + flatElement) * totalElementBuffs + 0.1), roundType),
        "Affinity": Math.min(1, affinity/100)
    }
}

function calculateRawDamage(
    totalRaw: number,
    affinity: number,
    criticalRange: 0.8 | 1 | 0.2 | 1.15,
    critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4,
    coating: 1 | 1.2 | 1.3 | 1.35,
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35,
    motionValue: number,
    antiSpecies: number,
    shotTypeUp: 1 | 1.05 | 1.1 | 1.2,
    rawHitZone: number,
    roundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter"
) {
    const noCrit = totalRaw * criticalRange * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp;
    const crit = totalRaw * criticalRange * (1 + (critDamage - 1)) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp;
    const average = totalRaw * criticalRange * (1 + (affinity * (critDamage - 1))) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp

    return {
        "NoCrit": customRound(noCrit, roundType),
        "Crit": customRound(crit, roundType),
        "Average": customRound(average, roundType)
    }
}

function calculateElementDamage(
    totalElement: number,
    affinity: number,
    critElement: 1 | 1.05 | 1.1 | 1.15,
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2,
    elementHitZone: number,
    elementExploit: number,
    roundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter"
) {
    const noCrit = totalElement * elementChargeLevel * elementHitZone * elementExploit;
    const crit = totalElement * (1 + (critElement - 1)) * elementChargeLevel * elementHitZone * elementExploit;
    const average = totalElement * (1 + (affinity * (critElement - 1))) * elementChargeLevel * elementHitZone * elementExploit;

    return {
        "NoCrit": customRound(noCrit, roundType),
        "Crit": customRound(crit, roundType),
        "Average": customRound(average, roundType)
    }
}

// From what I can see, Monster Hunter rounding for elemental damage seems to ignore all decimal places except the first
// and performs banker's rounding (so an exact .5 would round down instead of up).
function monsterHunterRound(numToRound: number): number {
    // if(numToRound.toString().includes(".")) {
        // return numToRound;
    // }
    try {
        let splitNumber = numToRound.toString().split(".");
        if(+splitNumber[1].substring(0,1) <= 5) {
            return +splitNumber[0];
        } else {
            return +splitNumber[0] + numToRound/Math.abs(numToRound);
        }
    } catch(error) {
        // I tried to use string.includes to find a ".", but my compiler refuses to cooperate for some reason.
        // This is a workaround until I can get includes working again.
        if(error instanceof TypeError) {
            return numToRound;
        } else {
            throw error;
        }
    }
}

function dragonConversionRound(numToRound: number): number {
    // if(numToRound.toString().includes(".")) {
        // return numToRound;
    // }
    try {
        let splitNumber = numToRound.toString().split(".");
        if(+splitNumber[1].substring(0,1) < 9) {
            return +splitNumber[0];
        } else {
            return +splitNumber[0] + numToRound/Math.abs(numToRound);
        }
    } catch(error) {
        // I tried to use string.includes to find a ".", but my compiler refuses to cooperate for some reason.
        // This is a workaround until I can get includes working again.
        if(error instanceof TypeError) {
            return numToRound;
        } else {
            throw error;
        }
    }
}

function printCritInfo(dataToPrint: calculationResult, expectedValue: number) {
    // console.log(`Hitzones: ${rawHitzone}/${elementHitzone} | Motion Value: ${motionValue}`)
    // console.log(`Raw: ${stats.Raw} | Element: ${stats.Element} | Affinity: ${stats.Affinity}`);
    // console.log(`Raw Damage: No Crit: ${raw.NoCrit} | Crit: ${raw.Crit} | Average ${raw.Average}`);
    // console.log(`Elemental Damage: No Crit: ${element.NoCrit} | Crit: ${element.Crit} | Average ${element.Average}`);
    // console.log(`Total Damage: No Crit: ${raw.NoCrit + element.NoCrit} | Crit: ${raw.Crit + element.Crit} | Average ${raw.Average + element.Average}`);
    const matching = expectedValue === dataToPrint.TotalCrit;
    console.log(`${dataToPrint.Name} / Expected: ${expectedValue} / ${dataToPrint.TotalCrit} = ${dataToPrint.RawCrit} + ${dataToPrint.ElementCrit} / ${matching}`);
    return matching;
}

function printNonCritInfo(dataToPrint: calculationResult, expectedValue: number) {
    const matching = expectedValue === dataToPrint.TotalNoCrit;
    console.log(`${dataToPrint.Name} / Expected: ${expectedValue} / ${dataToPrint.TotalNoCrit} = ${dataToPrint.RawNoCrit} + ${dataToPrint.ElementNoCrit} / ${matching}`);
    return matching;
}


function fullFireSpread(
    rawHitzone: number,
    elementHitzone: number, 
    motionValue: number, 
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, 
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2, 
    statRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    rawRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    elementRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    ) {
    const baseRaw = 350;
    const rawMultiplier = 1;
    const flatAttack = 20 + 20 + 18 + 9;
    const totalRawBuffs = 1;

    const baseElement = 76;
    const elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1 * 1.1;
    const flatElement = 4 + 4 + 8;
    const totalElementBuffs = 1;

    const affinity = 15 + 20 + 30 + 20;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.1;
    const elementExploit = 1.1; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);

    const data: calculationResult = {
        Name: "Full Fire Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

function fullThunderSpread(
    rawHitzone: number,
    elementHitzone: number, 
    motionValue: number, 
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, 
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2, 
    statRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    rawRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    elementRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    ) {
    const baseRaw = 350;
    const rawMultiplier = 1;
    const flatAttack = 20 + 20 + 18 + 9;
    const totalRawBuffs = 1;

    const baseElement = 77;
    const elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
    const flatElement = 4 + 4 + 8;
    const totalElementBuffs = 1;

    const affinity = 15 + 20 + 30 + 20;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.1;
    const elementExploit = 1.1; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);

    const data: calculationResult = {
        Name: "Full Thunder Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

function fullDragonSpread(
    rawHitzone: number,
    elementHitzone: number, 
    motionValue: number, 
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, 
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2, 
    statRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    rawRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    elementRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    ) {
    const baseRaw = 325;
    const rawMultiplier = 1;
    const flatAttack = 20 + 20 + 18 + 9;
    const totalRawBuffs = 1;

    const baseElement = 50;
    const elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
    const flatElement = 4 + 4 + 8;
    const totalElementBuffs = 1;

    const affinity = 40 + 15 + 20 + 20;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.1;
    const elementExploit = 1.15; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);

    const data: calculationResult = {
        Name: "Full Dragon Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

function fullWaterSpread(
    rawHitzone: number,
    elementHitzone: number, 
    motionValue: number, 
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, 
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2, 
    statRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    rawRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    elementRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    ) {
    const baseRaw = 360;
    const rawMultiplier = 1;
    const flatAttack = 20 + 20 + 18 + 9;
    const totalRawBuffs = 1;

    const baseElement = 58;
    const elementMultiplier = 1.2 * 1.1 * 1.2 * 1.2 * 1.1;
    const flatElement = 4 + 4 + 8;
    const totalElementBuffs = 1;

    const affinity = 15 + 20 + 30 + 20;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.1;
    const elementExploit = 1.15; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);

    const data: calculationResult = {
        Name: "Full Water Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

function fullIceSpread(
    rawHitzone: number,
    elementHitzone: number, 
    motionValue: number, 
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, 
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2, 
    statRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    rawRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    elementRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    ) {
    const baseRaw = 330;
    const rawMultiplier = 1;
    const flatAttack = 20 + 20 + 18 + 9;
    const totalRawBuffs = 1;

    const baseElement = 63;
    const elementMultiplier = 1.2 * 1.1 * 1.2 * 1.2 * 1.1;
    const flatElement = 4 + 4 + 8;
    const totalElementBuffs = 1;

    const affinity = 30 + 15 + 20 + 20;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.1;
    const elementExploit = 1.15; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);

    const data: calculationResult = {
        Name: "Full Ice Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

function teostraBowWithOnlySneakAttack(rawHitzone: number, elementHitzone: number, motionValue: number, rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, elementChargeLevel: 0.8 | 1 | 1.1 | 1.2, roundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter") {
    const baseRaw = 330;
    const rawMultiplier = 1.2;
    const flatAttack = 20;
    const totalRawBuffs = 1;

    const baseElement = 0;
    const elementMultiplier = 1;
    const flatElement = 0;
    const totalElementBuffs = 1;

    const affinity = 30;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.25; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1;
    const elementExploit = 1; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, "none");
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, "none");
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, "none");

    const data: calculationResult = {
        Name: "Teostra Bow only with sneak attack",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

// All Spread Bows are only considering crits

// Fire Body: 108 Got: 108 (107.56536000000001, 56.74536 + 50.820000000000014)
// Fire Head: 172 Got: 171 (170.80560000000003, 94.5756 + 76.23000000000002)

// Thunder Body: 104 Got: 104 (103.79016, 56.74536 + 47.0448)
// Thunder Head: 166 Got: 165 (165.14280000000002, 94.5756 + 70.56720000000001)

// Water Body: 100 Got: 99 (99.69935999999998, 58.106159999999996 + 41.593199999999996)
// Water Head: 160 Got: 159 (159.2334, 96.8436 + 62.3898)

// Ice Body: 99 Got: 99 (98.65296000000001, 54.023759999999996 + 44.629200000000004)
// Ice Head: 158 Got: 157 (156.9834, 90.0396 + 66.9438)

// Dragon Body: 87 Got: 87 (87.04296, 53.343360000000004 + 33.6996)
// Dragon Head: 140 Got: 139 (139.455, 88.9056 + 50.5494)

// Teostra bow only factors non-crits

// Body: 35 Got: 34.32
// Head: 58 Got: 57.2
// teostraBowWithOnlySneakAttack(0.6, 0.2, 0.11, 1.25, 1.1);
// teostraBowWithOnlySneakAttack(1, 0.3, 0.11, 1.25, 1.1);

function template(rawHitzone: number, elementHitzone: number, motionValue: number, rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, elementChargeLevel: 0.8 | 1 | 1.1 | 1.2) {
    const baseRaw = 1;
    const rawMultiplier = 1;
    const flatAttack = 20;
    const totalRawBuffs = 1;

    const baseElement = 0;
    const elementMultiplier = 1;
    const flatElement = 0;
    const totalElementBuffs = 1;

    const affinity = 0;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.25; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1;
    const elementExploit = 1; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, "none");
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, "none");
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, "none");

    console.log(`Hitzones: ${rawHitzone}/${elementHitzone} | Motion Value: ${motionValue}`)
    console.log(`Raw: ${stats.Raw} | Element: ${stats.Element} | Affinity: ${stats.Affinity}`);
    console.log(`Raw Damage: No Crit: ${raw.NoCrit} | Crit: ${raw.Crit} | Average ${raw.Average}`);
    console.log(`Elemental Damage: No Crit: ${element.NoCrit} | Crit: ${element.Crit} | Average ${element.Average}`);
    console.log(`Total Damage: No Crit: ${raw.NoCrit + element.NoCrit} | Crit: ${raw.Crit + element.Crit} | Average ${raw.Average + element.Average}`);
}

// The function is different for these ones because I'm using an identical build across all of them
function rapidBows(
    name: string, 
    baseRaw: number, 
    baseElement: number, 
    baseAffinity: number, 
    rawHitzone: number, 
    elementHitzone: number, 
    motionValue: number, 
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, 
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2, 
    dragonOrThunder: boolean,
    statRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    rawRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    elementRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    ) {
    const rawMultiplier = 1;
    const flatAttack = 20 + 20 + 18 + 9;
    const totalRawBuffs = 1;

    let elementMultiplier = 0;
    if(dragonOrThunder) {
        elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
    } else {
        elementMultiplier = 1.2 * 1.1 * 1.2 * 1.2 * 1.1;
    }
    const flatElement = 4 + 4 + 8;
    const totalElementBuffs = 1;

    const affinity = baseAffinity + 15 + 20;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.35; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.1;
    const elementExploit = 1.1; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);

    const data: calculationResult = {
        Name: name,
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

// Fire
// Body: 112 / Got: 111.32675400000002, 55.860354000000015 + 55.466400000000014
// Head: 177 / Got: 176.30019000000004, 93.10059000000003 + 83.1996

// Thunder
// Body: 90 / Got: 89.960904, 59.468903999999995 + 30.492000000000008
// Head: 145 / Got: 144.85284000000001, 45.73800000000001 + 99.11484

// Water
// Body: 103 / Got: 102.87941400000001, 60.190614000000004 + 42.68880000000001
// Head: 165 / Got: 164.35089000000002, 100.31769000000001 + 64.03320000000001

// Ice
// Body: 101 / Got: 100.838034, 61.634034 + 39.204
// Head: 162 / Got: 161.52939, 102.72339000000001 + 58.806

// Dragon
// Body: 107 / Got: 107.235414, 60.190614000000004 + 47.0448
// Head: 171 / Got: 170.88489000000004, 100.31769000000001 + 70.56720000000001

const sampleBows: BowInfo[] = [
    {
        Name: "Kamura Fine Iron Bow",
        Head: 51,
        Body: 31,
        MV: 0.11,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 350,
        Element: 0
    },
    {
        Name: "Barioth Bow",
        Head: 60,
        Body: 38,
        MV: 0.09,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 330,
        Element: 63
    },
    {
        Name: "Anjanath Bow",
        Head: 55,
        Body: 33,
        MV: 0.1,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 360,
        Element: 20
    },
    {
        Name: "Flaming Espinas Bow",
        Head: 55,
        Body: 34,
        MV: 0.1,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 350,
        Element: 27
    },
    {
        Name: "Gore Bow",
        Head: 52,
        Body: 31,
        MV: 0.1,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 330,
        Element: 23
    },
    {
        Name: "Gold Rathian Bow",
        Head: 51,
        Body: 31,
        MV: 0.09,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 350,
        Element: 28
    },
    {
        Name: "Arzuros Bow",
        Head: 39,
        Body: 23,
        MV: 0.08,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 370,
        Element: 0
    },
    {
        Name: "Rathian Bow",
        Head: 67,
        Body: 42,
        MV: 0.09,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 350,
        Element: 76
    },
    {
        Name: "Heaven's Breath",
        Head: 57,
        Body: 36,
        MV: 0.1,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 300,
        Element: 53
    },
    {
        Name: "Tigrex Bow",
        Head: 58,
        Body: 35,
        MV: 0.11,
        RawCharge: 1.25,
        ElementCharge: 1.1,
        Attack: 400,
        Element: 0
    },
];

function calculateSampleBows(
    name: string, 
    baseRaw: number, 
    baseElement: number, 
    rawHitzone: number, 
    elementHitzone: number, 
    motionValue: number, 
    rawChargeLevel: 0.65 | 1 | 1.25 | 1.35, 
    elementChargeLevel: 0.8 | 1 | 1.1 | 1.2,
    statRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    rawRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    elementRoundType: "none" | "ceiling" | "floor" | "normal" | "monster hunter",
    ) {
    const rawMultiplier = 1;
    const flatAttack = 20;
    const totalRawBuffs = 1;

    const elementMultiplier = 1;
    const flatElement = 0;
    const totalElementBuffs = 1;

    const affinity = 0;

    const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
    const critDamage: 0.75 | 1.25 | 1.3 | 1.35 | 1.4 = 1.25; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    const coating: 1 | 1.2 | 1.3 | 1.35 = 1; // No Coating | Close Range | Bladescale Hone | Power
    const antiSpecies = 1; // Still need to work this one out
    const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1;

    const critElement: 1 | 1.05 | 1.1 | 1.15 = 1;
    const elementExploit = 1; // Elembane and Element Exploit are additive

    const stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    const raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    const element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);

    const data: calculationResult = {
        Name: name,
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average,
    }
    return data;
}

function functionCalls() {
    // For brute forcing every single combination of rounding steps

    // const RT: ("none" | "ceiling" | "floor" | "normal" | "monster hunter")[] = ["none", "ceiling", "floor", "normal", "monster hunter"]

    // for(let i = 0;i<RT.length;i++) {
    //     for(let j = 0;j<RT.length;j++) {
    //         for(let k = 0;k<RT.length;k++) {
    //             let counter = 0;
    //             if(printCritInfo(fullFireSpread(0.6, 0.2, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 108)) counter++;
    //             if(printCritInfo(fullFireSpread(1, 0.3, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 172)) counter++;
    //             if(printCritInfo(fullThunderSpread(0.6, 0.2, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 104)) counter++;
    //             if(printCritInfo(fullThunderSpread(1, 0.3, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 166)) counter++;
    //             if(printCritInfo(fullWaterSpread(0.6, 0.2, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 100)) counter++;
    //             if(printCritInfo(fullWaterSpread(1, 0.3, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 160)) counter++;
    //             if(printCritInfo(fullIceSpread(0.6, 0.2, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 99)) counter++;
    //             if(printCritInfo(fullIceSpread(1, 0.3, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 158)) counter++;
    //             if(printCritInfo(fullDragonSpread(0.6, 0.2, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 87)) counter++;
    //             if(printCritInfo(fullDragonSpread(1, 0.3, 0.1, 1.35, 1.2, RT[i], RT[j], RT[k]), 140)) counter++;
    //             if(printCritInfo(rapidBows("Fire Rapid Body", 320, 84, 35, 0.6, 0.2, 0.11, 1.35, 1.2, false, RT[i], RT[j], RT[k]), 112)) counter++;
    //             if(printCritInfo(rapidBows("Fire Rapid Head", 320, 84, 35, 1, 0.3, 0.11, 1.35, 1.2, false, RT[i], RT[j], RT[k]), 177)) counter++;
    //             if(printCritInfo(rapidBows("Thunder Rapid Body", 345, 47, 15, 0.6, 0.2, 0.11, 1.35, 1.2, true, RT[i], RT[j], RT[k]), 90)) counter++;
    //             if(printCritInfo(rapidBows("Thunder Rapid Body", 345, 47, 15, 1, 0.3, 0.11, 1.35, 1.2, true, RT[i], RT[j], RT[k]), 145)) counter++;
    //             if(printCritInfo(rapidBows("Water Rapid Body", 350, 63, 15, 0.6, 0.2, 0.11, 1.35, 1.2, false, RT[i], RT[j], RT[k]), 103)) counter++;
    //             if(printCritInfo(rapidBows("Water Rapid Body", 350, 63, 15, 1, 0.3, 0.11, 1.35, 1.2, false, RT[i], RT[j], RT[k]), 165)) counter++;
    //             if(printCritInfo(rapidBows("Ice Rapid Body", 360, 57, 0, 0.6, 0.2, 0.11, 1.35, 1.2, false, RT[i], RT[j], RT[k]), 101)) counter++;
    //             if(printCritInfo(rapidBows("Ice Rapid Body", 360, 57, 0, 1, 0.3, 0.11, 1.35, 1.2, false, RT[i], RT[j], RT[k]), 162)) counter++;
    //             if(printCritInfo(rapidBows("Dragon Rapid Body", 350, 77, 15, 0.6, 0.2, 0.11, 1.35, 1.2, true, RT[i], RT[j], RT[k]), 107)) counter++;
    //             if(printCritInfo(rapidBows("Dragon Rapid Body", 350, 77, 15, 1, 0.3, 0.11, 1.35, 1.2, true, RT[i], RT[j], RT[k]), 171)) counter++;

    //             for(let l = 0; l < sampleBows.length; l++) {
    //                 const currentBow = sampleBows[l];
    //                 const body = calculateSampleBows(currentBow.Name, currentBow.Attack, currentBow.Element, 0.6, 0.2, currentBow.MV, currentBow.RawCharge, currentBow.ElementCharge, RT[i], RT[j], RT[k]);
    //                 const head = calculateSampleBows(currentBow.Name, currentBow.Attack, currentBow.Element, 1, 0.3, currentBow.MV, currentBow.RawCharge, currentBow.ElementCharge, RT[i], RT[j], RT[k]);
    //                 if(printNonCritInfo(body, currentBow.Body)) counter++;
    //                 if(printNonCritInfo(head, currentBow.Head)) counter++;
    //             }

    //             console.log(`${RT[i]}/${RT[j]}/${RT[k]}: ${counter/40}`);
    //         }
    //     }
    // }

    const statRT = "ceiling";
    const rawRT = "monster hunter";
    const elementRT = "monster hunter"

    let counter = 0;
    if(printCritInfo(fullFireSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 108)) counter++;
    if(printCritInfo(fullFireSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 172)) counter++;
    if(printCritInfo(fullThunderSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 104)) counter++;
    if(printCritInfo(fullThunderSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 166)) counter++;
    if(printCritInfo(fullWaterSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 100)) counter++;
    if(printCritInfo(fullWaterSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 160)) counter++;
    if(printCritInfo(fullIceSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 99)) counter++;
    if(printCritInfo(fullIceSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 158)) counter++;
    if(printCritInfo(fullDragonSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 87)) counter++;
    if(printCritInfo(fullDragonSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 140)) counter++;
    if(printCritInfo(rapidBows("Fire Rapid Body", 320, 84, 35, 0.6, 0.2, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 112)) counter++;
    if(printCritInfo(rapidBows("Fire Rapid Head", 320, 84, 35, 1, 0.3, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 177)) counter++;
    if(printCritInfo(rapidBows("Thunder Rapid Body", 345, 47, 15, 0.6, 0.2, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 90)) counter++;
    if(printCritInfo(rapidBows("Thunder Rapid Body", 345, 47, 15, 1, 0.3, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 145)) counter++;
    if(printCritInfo(rapidBows("Water Rapid Body", 350, 63, 15, 0.6, 0.2, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 103)) counter++;
    if(printCritInfo(rapidBows("Water Rapid Body", 350, 63, 15, 1, 0.3, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 165)) counter++;
    if(printCritInfo(rapidBows("Ice Rapid Body", 360, 57, 0, 0.6, 0.2, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 101)) counter++;
    if(printCritInfo(rapidBows("Ice Rapid Body", 360, 57, 0, 1, 0.3, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 162)) counter++;
    if(printCritInfo(rapidBows("Dragon Rapid Body", 350, 77, 15, 0.6, 0.2, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 107)) counter++;
    if(printCritInfo(rapidBows("Dragon Rapid Body", 350, 77, 15, 1, 0.3, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 171)) counter++;

    for(let l = 0; l < sampleBows.length; l++) {
        const currentBow = sampleBows[l];
        const body = calculateSampleBows(currentBow.Name, currentBow.Attack, currentBow.Element, 0.6, 0.2, currentBow.MV, currentBow.RawCharge, currentBow.ElementCharge, statRT, rawRT, elementRT);
        const head = calculateSampleBows(currentBow.Name, currentBow.Attack, currentBow.Element, 1, 0.3, currentBow.MV, currentBow.RawCharge, currentBow.ElementCharge, statRT, rawRT, elementRT);
        if(printNonCritInfo(body, currentBow.Body)) counter++;
        if(printNonCritInfo(head, currentBow.Head)) counter++;
    }

    console.log(`${counter/40}`);
}

// functionCalls();

interface BowInfo {
    Name: string;
    Head: number;
    Body: number;
    MV: number;
    RawCharge: 0.65 | 1 | 1.25 | 1.35;
    ElementCharge: 0.8 | 1 | 1.1 | 1.2;
    Attack: number;
    Element: number;
}

interface calculationResult {
    Name: string;
    RawNoCrit: number;
    RawCrit: number;
    RawAverage: number;
    ElementNoCrit: number;
    ElementCrit: number;
    ElementAverage: number;
    TotalNoCrit: number;
    TotalCrit: number;
    TotalAverage: number;
}