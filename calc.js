// Stats
var baseRaw = 320;
var rawMultiplier = 1;
var flatAttack = 8 + 20 + 18 + 9;
var totalRawBuffs = 1; // Hunting horn buffs to here
var totalRaw = Math.floor(((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1);
var baseElement = 45;
var elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
var flatElement = 4 + 4 + 8;
var totalElementBuffs = 1; // Hunting horn buffs go here
var totalElement = Math.floor(((baseElement * elementMultiplier) + flatElement) * totalElementBuffs + 0.1);
var affinity = 40 + 15 + 20 + 20;
affinity = Math.min(1, affinity / 100);
// Damage Calculations
var criticalRange = 1; // Close | Normal | Far | Supercritical
var critDamage = 1.35; // Negative Crit | No Crit | Normal Crit | CB1 | CB2 | CB3
var coating = 1.3; // No Coating | Close Range | Bladescale Hone | Power
var rawChargeLevel = 1.35;
var motionValue = 0.1;
var rawHitZone = 0.45;
var antiSpecies = 1; // Still need to work this one out
var shotTypeUp = 1.2;
var rawDamageNoCrit = Math.round(totalRaw * criticalRange * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);
var rawDamageCrit = Math.round(totalRaw * criticalRange * (1 + (critDamage - 1)) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);
var rawDamageAverage = Math.round(totalRaw * criticalRange * (1 + (affinity * (critDamage - 1))) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);
var critElement = 1.15;
var elementChargeLevel = 1.2; // Based on charge level
var elementHitZone = 0.2;
var elementExploit = 1.1; // Elembane and Element Exploit are additive
var elementDamageNoCrit = monsterHunterRound(totalElement * elementChargeLevel * elementHitZone * elementExploit);
var elementDamageCrit = monsterHunterRound(totalElement * (1 + (critElement - 1)) * elementChargeLevel * elementHitZone * elementExploit);
var elementDamageAverage = monsterHunterRound(totalElement * (1 + (affinity * (critElement - 1))) * elementChargeLevel * elementHitZone * elementExploit);
var totalDamageNoCrit = rawDamageNoCrit + elementDamageNoCrit;
var totalDamageCrit = rawDamageCrit + elementDamageCrit;
var totalDamageAverage = rawDamageAverage + elementDamageAverage;
console.log("Total Raw: ".concat(totalRaw));
console.log("Total Element: ".concat(totalElement));
console.log("Raw Damage: No Crit: ".concat(rawDamageNoCrit, " | Crit: ").concat(rawDamageCrit, " | Average ").concat(rawDamageAverage));
console.log("Elemental Damage: No Crit: ".concat(elementDamageNoCrit, " | Crit: ").concat(elementDamageCrit, " | Average ").concat(elementDamageAverage));
console.log("Total Damage: No Crit: ".concat(totalDamageNoCrit, " | Crit: ").concat(totalDamageCrit, " | Average ").concat(totalDamageAverage));
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
