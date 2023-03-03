// Stats
var baseRaw = 320;
var rawMultiplier = 1;
var flatAttack = 8 + 20 + 18 + 8;
var totalRawBuffs = 1;
var totalRaw = Math.floor(((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1);
console.log("Total Raw: ".concat(totalRaw));
var baseElement = 45;
var elementMultiplier = 1.2 * 1.2 * 1.2;
var flatElement = 8 + 6;
var totalElement = Math.floor((baseElement * elementMultiplier) + flatElement + 0.1);
console.log("Total Element: ".concat(totalElement));
// Damage Calculations
var criticalRange = 1; // Close | Normal | Far | Supercritical
var critDamage = 1.4; // Negative Crit | No Crit | Normal Crit | CB1 | CB2 | CB3
var coating = 1.3; // No Coating | Close Range | Bladescale Hone | Power
var rawChargeLevel = 1.35;
var motionValue = 0.1;
var rawHitZone = 0.6;
var antiSpecies = 1; // Still need to work this one out
var shotTypeUp = 1.2;
var rawDamage = Math.round(totalRaw * criticalRange * critDamage * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);
console.log("Raw Damage: ".concat(rawDamage));
var critElement = 1.15;
var elementChargeLevel = 1.2; // Based on charge level
var elementHitZone = 0.2;
var elementExploit = 1.1; // Elembane and Element Exploit are additive
var elementDamage = monsterHunterRound(totalElement * critElement * elementChargeLevel * elementHitZone * elementExploit);
console.log("Elemental Damage: ".concat(elementDamage));
var totalDamage = rawDamage + elementDamage;
console.log("Total Damage: ".concat(totalDamage));
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
