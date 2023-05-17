// Stats
var baseRaw = 350;
var rawMultiplier = 1;
var flatAttack = 20 + 3;
var totalRawBuffs = 1; // Hunting horn buffs to here
var totalRaw = Math.floor(((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1);
var dragonConversion = 0.08; // None | DC1, DC2 | DC3 
var dragonConversionBuff = 75;
var fireRes = 19;
var waterRes = 27;
var thunderRes = 13;
var iceRes = 13;
var dragonRes = 2;
var dragonConversionElement = dragonConversionRound((fireRes + waterRes + thunderRes + iceRes + dragonRes + dragonConversionBuff) * dragonConversion);
var baseElement = 77;
var elementMultiplier = 1; // Multiplicative with each other
var flatElement = 0;
var totalElementBuffs = 1; // Hunting horn buffs go here
var totalElement = Math.floor(((baseElement * elementMultiplier) + flatElement + dragonConversionElement) * totalElementBuffs + 0.1);
var affinity = 0;
affinity = Math.min(1, affinity / 100);
// Damage Calculations
var frostcraft = 1;
var criticalRange = 1; // Close | Normal | Far | Supercritical
var critDamage = 1.35; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
var rawChargeLevel = 1.25;
var motionValue = 0.09;
var rawHitZone = 0.6;
var antiSpecies = 1; // Still need to work this one out
var shotTypeUp = 1;
var rawDamageNoCrit = monsterHunterRound(totalRaw * criticalRange * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp * frostcraft);
var rawDamageCrit = monsterHunterRound(totalRaw * criticalRange * (1 + (critDamage - 1)) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp * frostcraft);
var rawDamageAverage = monsterHunterRound(totalRaw * criticalRange * (1 + (affinity * (critDamage - 1))) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp * frostcraft);
var critElement = 1;
var elementChargeLevel = 1.1; // Based on charge level
var elementHitZone = 0.2;
var elementExploit = 1; // Elembane and Element Exploit are additive
var elementDamageNoCrit = monsterHunterRound(totalElement * elementChargeLevel * elementHitZone * elementExploit * frostcraft);
var elementDamageCrit = monsterHunterRound(totalElement * (1 + (critElement - 1)) * elementChargeLevel * elementHitZone * elementExploit * frostcraft);
var elementDamageAverage = monsterHunterRound(totalElement * (1 + (affinity * (critElement - 1))) * elementChargeLevel * elementHitZone * elementExploit * frostcraft);
var totalDamageNoCrit = rawDamageNoCrit + elementDamageNoCrit;
var totalDamageCrit = rawDamageCrit + elementDamageCrit;
var totalDamageAverage = rawDamageAverage + elementDamageAverage;
console.log("Total Raw: ".concat(totalRaw));
console.log("Total Element: ".concat(totalElement));
console.log("Raw Damage: No Crit: ".concat(rawDamageNoCrit, " | Crit: ").concat(rawDamageCrit, " | Average ").concat(rawDamageAverage));
console.log("Elemental Damage: No Crit: ".concat(elementDamageNoCrit, " | Crit: ").concat(elementDamageCrit, " | Average ").concat(elementDamageAverage));
console.log("Total Damage: No Crit: ".concat(totalDamageNoCrit, " | Crit: ").concat(totalDamageCrit, " | Average ").concat(totalDamageAverage));
function customRound(numberToRound, type) {
    if (type === "none") {
        return numberToRound;
    }
    else if (type === "ceiling") {
        return Math.ceil(numberToRound);
    }
    else if (type === "floor") {
        return Math.floor(numberToRound);
    }
    else if (type === "normal") {
        return Math.round(numberToRound);
    }
    else {
        return monsterHunterRound(numberToRound);
    }
}
function calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, roundType) {
    return {
        "Raw": customRound((((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1), roundType),
        "Element": customRound((((baseElement * elementMultiplier) + flatElement) * totalElementBuffs + 0.1), roundType),
        "Affinity": Math.min(1, affinity / 100)
    };
}
function calculateRawDamage(totalRaw, affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitZone, roundType) {
    var noCrit = totalRaw * criticalRange * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp;
    var crit = totalRaw * criticalRange * (1 + (critDamage - 1)) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp;
    var average = totalRaw * criticalRange * (1 + (affinity * (critDamage - 1))) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp;
    return {
        "NoCrit": customRound(noCrit, roundType),
        "Crit": customRound(crit, roundType),
        "Average": customRound(average, roundType)
    };
}
function calculateElementDamage(totalElement, affinity, critElement, elementChargeLevel, elementHitZone, elementExploit, roundType) {
    var noCrit = totalElement * elementChargeLevel * elementHitZone * elementExploit;
    var crit = totalElement * (1 + (critElement - 1)) * elementChargeLevel * elementHitZone * elementExploit;
    var average = totalElement * (1 + (affinity * (critElement - 1))) * elementChargeLevel * elementHitZone * elementExploit;
    return {
        "NoCrit": customRound(noCrit, roundType),
        "Crit": customRound(crit, roundType),
        "Average": customRound(average, roundType)
    };
}
// From what I can see, Monster Hunter rounding for elemental damage seems to ignore all decimal places except the first
// and performs banker's rounding (so an exact .5 would round down instead of up).
function monsterHunterRound(numToRound) {
    // if(numToRound.toString().includes(".")) {
    // return numToRound;
    // }
    try {
        var splitNumber = numToRound.toString().split(".");
        if (+splitNumber[1].substring(0, 1) <= 5) {
            return +splitNumber[0];
        }
        else {
            return +splitNumber[0] + numToRound / Math.abs(numToRound);
        }
    }
    catch (error) {
        // I tried to use string.includes to find a ".", but my compiler refuses to cooperate for some reason.
        // This is a workaround until I can get includes working again.
        if (error instanceof TypeError) {
            return numToRound;
        }
        else {
            throw error;
        }
    }
}
function dragonConversionRound(numToRound) {
    // if(numToRound.toString().includes(".")) {
    // return numToRound;
    // }
    try {
        var splitNumber = numToRound.toString().split(".");
        if (+splitNumber[1].substring(0, 1) < 9) {
            return +splitNumber[0];
        }
        else {
            return +splitNumber[0] + numToRound / Math.abs(numToRound);
        }
    }
    catch (error) {
        // I tried to use string.includes to find a ".", but my compiler refuses to cooperate for some reason.
        // This is a workaround until I can get includes working again.
        if (error instanceof TypeError) {
            return numToRound;
        }
        else {
            throw error;
        }
    }
}
function printCritInfo(dataToPrint, expectedValue) {
    // console.log(`Hitzones: ${rawHitzone}/${elementHitzone} | Motion Value: ${motionValue}`)
    // console.log(`Raw: ${stats.Raw} | Element: ${stats.Element} | Affinity: ${stats.Affinity}`);
    // console.log(`Raw Damage: No Crit: ${raw.NoCrit} | Crit: ${raw.Crit} | Average ${raw.Average}`);
    // console.log(`Elemental Damage: No Crit: ${element.NoCrit} | Crit: ${element.Crit} | Average ${element.Average}`);
    // console.log(`Total Damage: No Crit: ${raw.NoCrit + element.NoCrit} | Crit: ${raw.Crit + element.Crit} | Average ${raw.Average + element.Average}`);
    var matching = expectedValue === dataToPrint.TotalCrit;
    console.log("".concat(dataToPrint.Name, " / Expected: ").concat(expectedValue, " / ").concat(dataToPrint.TotalCrit, " = ").concat(dataToPrint.RawCrit, " + ").concat(dataToPrint.ElementCrit, " / ").concat(matching));
    return matching;
}
function printNonCritInfo(dataToPrint, expectedValue) {
    var matching = expectedValue === dataToPrint.TotalNoCrit;
    console.log("".concat(dataToPrint.Name, " / Expected: ").concat(expectedValue, " / ").concat(dataToPrint.TotalNoCrit, " = ").concat(dataToPrint.RawNoCrit, " + ").concat(dataToPrint.ElementNoCrit, " / ").concat(matching));
    return matching;
}
function fullFireSpread(rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, statRoundType, rawRoundType, elementRoundType) {
    var baseRaw = 350;
    var rawMultiplier = 1;
    var flatAttack = 20 + 20 + 18 + 9;
    var totalRawBuffs = 1;
    var baseElement = 76;
    var elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1 * 1.1;
    var flatElement = 4 + 4 + 8;
    var totalElementBuffs = 1;
    var affinity = 15 + 20 + 30 + 20;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1.2;
    var critElement = 1.1;
    var elementExploit = 1.1; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);
    var data = {
        Name: "Full Fire Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
    return data;
}
function fullThunderSpread(rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, statRoundType, rawRoundType, elementRoundType) {
    var baseRaw = 350;
    var rawMultiplier = 1;
    var flatAttack = 20 + 20 + 18 + 9;
    var totalRawBuffs = 1;
    var baseElement = 77;
    var elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
    var flatElement = 4 + 4 + 8;
    var totalElementBuffs = 1;
    var affinity = 15 + 20 + 30 + 20;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1.2;
    var critElement = 1.1;
    var elementExploit = 1.1; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);
    var data = {
        Name: "Full Thunder Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
    return data;
}
function fullDragonSpread(rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, statRoundType, rawRoundType, elementRoundType) {
    var baseRaw = 325;
    var rawMultiplier = 1;
    var flatAttack = 20 + 20 + 18 + 9;
    var totalRawBuffs = 1;
    var baseElement = 50;
    var elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
    var flatElement = 4 + 4 + 8;
    var totalElementBuffs = 1;
    var affinity = 40 + 15 + 20 + 20;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1.2;
    var critElement = 1.1;
    var elementExploit = 1.15; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);
    var data = {
        Name: "Full Dragon Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
    return data;
}
function fullWaterSpread(rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, statRoundType, rawRoundType, elementRoundType) {
    var baseRaw = 360;
    var rawMultiplier = 1;
    var flatAttack = 20 + 20 + 18 + 9;
    var totalRawBuffs = 1;
    var baseElement = 58;
    var elementMultiplier = 1.2 * 1.1 * 1.2 * 1.2 * 1.1;
    var flatElement = 4 + 4 + 8;
    var totalElementBuffs = 1;
    var affinity = 15 + 20 + 30 + 20;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1.2;
    var critElement = 1.1;
    var elementExploit = 1.15; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);
    var data = {
        Name: "Full Water Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
    return data;
}
function fullIceSpread(rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, statRoundType, rawRoundType, elementRoundType) {
    var baseRaw = 330;
    var rawMultiplier = 1;
    var flatAttack = 20 + 20 + 18 + 9;
    var totalRawBuffs = 1;
    var baseElement = 63;
    var elementMultiplier = 1.2 * 1.1 * 1.2 * 1.2 * 1.1;
    var flatElement = 4 + 4 + 8;
    var totalElementBuffs = 1;
    var affinity = 30 + 15 + 20 + 20;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.4; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1.2;
    var critElement = 1.1;
    var elementExploit = 1.15; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);
    var data = {
        Name: "Full Ice Spread",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
    return data;
}
function teostraBowWithOnlySneakAttack(rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, roundType) {
    var baseRaw = 330;
    var rawMultiplier = 1.2;
    var flatAttack = 20;
    var totalRawBuffs = 1;
    var baseElement = 0;
    var elementMultiplier = 1;
    var flatElement = 0;
    var totalElementBuffs = 1;
    var affinity = 30;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.25; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1;
    var critElement = 1;
    var elementExploit = 1; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, "none");
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, "none");
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, "none");
    var data = {
        Name: "Teostra Bow only with sneak attack",
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
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
function template(rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel) {
    var baseRaw = 1;
    var rawMultiplier = 1;
    var flatAttack = 20;
    var totalRawBuffs = 1;
    var baseElement = 0;
    var elementMultiplier = 1;
    var flatElement = 0;
    var totalElementBuffs = 1;
    var affinity = 0;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.25; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1;
    var critElement = 1;
    var elementExploit = 1; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, "none");
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, "none");
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, "none");
    console.log("Hitzones: ".concat(rawHitzone, "/").concat(elementHitzone, " | Motion Value: ").concat(motionValue));
    console.log("Raw: ".concat(stats.Raw, " | Element: ").concat(stats.Element, " | Affinity: ").concat(stats.Affinity));
    console.log("Raw Damage: No Crit: ".concat(raw.NoCrit, " | Crit: ").concat(raw.Crit, " | Average ").concat(raw.Average));
    console.log("Elemental Damage: No Crit: ".concat(element.NoCrit, " | Crit: ").concat(element.Crit, " | Average ").concat(element.Average));
    console.log("Total Damage: No Crit: ".concat(raw.NoCrit + element.NoCrit, " | Crit: ").concat(raw.Crit + element.Crit, " | Average ").concat(raw.Average + element.Average));
}
// The function is different for these ones because I'm using an identical build across all of them
function rapidBows(name, baseRaw, baseElement, baseAffinity, rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, dragonOrThunder, statRoundType, rawRoundType, elementRoundType) {
    var rawMultiplier = 1;
    var flatAttack = 20 + 20 + 18 + 9;
    var totalRawBuffs = 1;
    var elementMultiplier = 0;
    if (dragonOrThunder) {
        elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
    }
    else {
        elementMultiplier = 1.2 * 1.1 * 1.2 * 1.2 * 1.1;
    }
    var flatElement = 4 + 4 + 8;
    var totalElementBuffs = 1;
    var affinity = baseAffinity + 15 + 20;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.35; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1.2;
    var critElement = 1.1;
    var elementExploit = 1.1; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);
    var data = {
        Name: name,
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
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
var sampleBows = [
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
function calculateSampleBows(name, baseRaw, baseElement, rawHitzone, elementHitzone, motionValue, rawChargeLevel, elementChargeLevel, statRoundType, rawRoundType, elementRoundType) {
    var rawMultiplier = 1;
    var flatAttack = 20;
    var totalRawBuffs = 1;
    var elementMultiplier = 1;
    var flatElement = 0;
    var totalElementBuffs = 1;
    var affinity = 0;
    var criticalRange = 1; // Close | Normal | Far | Supercritical
    var critDamage = 1.25; // Negative Crit | Normal Crit | CB1 | CB2 | CB3
    var coating = 1; // No Coating | Close Range | Bladescale Hone | Power
    var antiSpecies = 1; // Still need to work this one out
    var shotTypeUp = 1;
    var critElement = 1;
    var elementExploit = 1; // Elembane and Element Exploit are additive
    var stats = calculateStats(baseRaw, rawMultiplier, flatAttack, totalRawBuffs, affinity, baseElement, elementMultiplier, flatElement, totalElementBuffs, statRoundType);
    var raw = calculateRawDamage(stats.Raw, stats.Affinity, criticalRange, critDamage, coating, rawChargeLevel, motionValue, antiSpecies, shotTypeUp, rawHitzone, rawRoundType);
    var element = calculateElementDamage(stats.Element, stats.Affinity, critElement, elementChargeLevel, elementHitzone, elementExploit, elementRoundType);
    var data = {
        Name: name,
        RawNoCrit: raw.NoCrit,
        RawCrit: raw.Crit,
        RawAverage: raw.Average,
        ElementNoCrit: element.NoCrit,
        ElementCrit: element.Crit,
        ElementAverage: element.Average,
        TotalNoCrit: raw.NoCrit + element.NoCrit,
        TotalCrit: raw.Crit + element.Crit,
        TotalAverage: raw.Average + element.Average
    };
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
    var statRT = "ceiling";
    var rawRT = "monster hunter";
    var elementRT = "monster hunter";
    var counter = 0;
    if (printCritInfo(fullFireSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 108))
        counter++;
    if (printCritInfo(fullFireSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 172))
        counter++;
    if (printCritInfo(fullThunderSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 104))
        counter++;
    if (printCritInfo(fullThunderSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 166))
        counter++;
    if (printCritInfo(fullWaterSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 100))
        counter++;
    if (printCritInfo(fullWaterSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 160))
        counter++;
    if (printCritInfo(fullIceSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 99))
        counter++;
    if (printCritInfo(fullIceSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 158))
        counter++;
    if (printCritInfo(fullDragonSpread(0.6, 0.2, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 87))
        counter++;
    if (printCritInfo(fullDragonSpread(1, 0.3, 0.1, 1.35, 1.2, statRT, rawRT, elementRT), 140))
        counter++;
    if (printCritInfo(rapidBows("Fire Rapid Body", 320, 84, 35, 0.6, 0.2, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 112))
        counter++;
    if (printCritInfo(rapidBows("Fire Rapid Head", 320, 84, 35, 1, 0.3, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 177))
        counter++;
    if (printCritInfo(rapidBows("Thunder Rapid Body", 345, 47, 15, 0.6, 0.2, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 90))
        counter++;
    if (printCritInfo(rapidBows("Thunder Rapid Body", 345, 47, 15, 1, 0.3, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 145))
        counter++;
    if (printCritInfo(rapidBows("Water Rapid Body", 350, 63, 15, 0.6, 0.2, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 103))
        counter++;
    if (printCritInfo(rapidBows("Water Rapid Body", 350, 63, 15, 1, 0.3, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 165))
        counter++;
    if (printCritInfo(rapidBows("Ice Rapid Body", 360, 57, 0, 0.6, 0.2, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 101))
        counter++;
    if (printCritInfo(rapidBows("Ice Rapid Body", 360, 57, 0, 1, 0.3, 0.11, 1.35, 1.2, false, statRT, rawRT, elementRT), 162))
        counter++;
    if (printCritInfo(rapidBows("Dragon Rapid Body", 350, 77, 15, 0.6, 0.2, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 107))
        counter++;
    if (printCritInfo(rapidBows("Dragon Rapid Body", 350, 77, 15, 1, 0.3, 0.11, 1.35, 1.2, true, statRT, rawRT, elementRT), 171))
        counter++;
    for (var l = 0; l < sampleBows.length; l++) {
        var currentBow = sampleBows[l];
        var body = calculateSampleBows(currentBow.Name, currentBow.Attack, currentBow.Element, 0.6, 0.2, currentBow.MV, currentBow.RawCharge, currentBow.ElementCharge, statRT, rawRT, elementRT);
        var head = calculateSampleBows(currentBow.Name, currentBow.Attack, currentBow.Element, 1, 0.3, currentBow.MV, currentBow.RawCharge, currentBow.ElementCharge, statRT, rawRT, elementRT);
        if (printNonCritInfo(body, currentBow.Body))
            counter++;
        if (printNonCritInfo(head, currentBow.Head))
            counter++;
    }
    console.log("".concat(counter / 40));
}
