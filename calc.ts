// Stats
const baseRaw = 320;
const rawMultiplier = 1;
const flatAttack = 8 + 20 + 18 + 9;
const totalRawBuffs = 1; // Hunting horn buffs to here
const totalRaw = Math.floor(((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1);

const baseElement = 45;
const elementMultiplier = 1.2 * 1.2 * 1.2 * 1.1;
const flatElement = 4 + 4 + 8;
const totalElementBuffs = 1; // Hunting horn buffs go here
const totalElement = Math.floor(((baseElement * elementMultiplier) + flatElement) * totalElementBuffs + 0.1);

let affinity = 40 + 15 + 20 + 20;
affinity = Math.min(1, affinity/100);

// Damage Calculations
const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
const critDamage: 0.75 | 1 | 1.25 | 1.3 | 1.35 | 1.4 = 1.4; // Negative Crit | No Crit | Normal Crit | CB1 | CB2 | CB3
const coating: 1 | 1.2 | 1.3 | 1.35 = 1.3; // No Coating | Close Range | Bladescale Hone | Power
const rawChargeLevel: 0.65 | 1 | 1.25 | 1.35 = 1.35;
const motionValue = 0.1;
const rawHitZone = 0.45;
const antiSpecies = 1; // Still need to work this one out
const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

const rawDamageNoCrit = Math.round(totalRaw * criticalRange * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);
const rawDamageCrit = Math.round(totalRaw * criticalRange * (1 + (critDamage - 1)) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);
const rawDamageAverage = Math.round(totalRaw * criticalRange * (1 + (affinity * (critDamage - 1))) * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);

const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.1;
const elementChargeLevel: 0.8 | 1 | 1.1 | 1.2 = 1.2; // Based on charge level
const elementHitZone = 0.2;
const elementExploit = 1.1; // Elembane and Element Exploit are additive

const elementDamageNoCrit = monsterHunterRound(totalElement * elementChargeLevel * elementHitZone * elementExploit);
const elementDamageCrit = monsterHunterRound(totalElement * (1 + (critElement - 1)) * elementChargeLevel * elementHitZone * elementExploit);
const elementDamageAverage = monsterHunterRound(totalElement * (1 + (affinity * (critElement - 1))) * elementChargeLevel * elementHitZone * elementExploit);

const totalDamageNoCrit = rawDamageNoCrit + elementDamageNoCrit;
const totalDamageCrit = rawDamageCrit + elementDamageCrit;
const totalDamageAverage = rawDamageAverage + elementDamageAverage;

console.log(`Total Raw: ${totalRaw}`);
console.log(`Total Element: ${totalElement}`);

console.log(`Raw Damage: No Crit: ${rawDamageNoCrit} | Crit: ${rawDamageCrit} | Average ${rawDamageAverage}`);
console.log(`Elemental Damage: No Crit: ${elementDamageNoCrit} | Crit: ${elementDamageCrit} | Average ${elementDamageAverage}`);

console.log(`Total Damage: No Crit: ${totalDamageNoCrit} | Crit: ${totalDamageCrit} | Average ${totalDamageAverage}`);

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