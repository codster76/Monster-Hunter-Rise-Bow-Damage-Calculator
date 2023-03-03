// Stats
const baseRaw = 320;
const rawMultiplier = 1;
const flatAttack = 8 + 20 + 18 + 8;
const totalRawBuffs = 1;
const totalRaw = Math.floor(((baseRaw * rawMultiplier) + flatAttack) * totalRawBuffs + 0.1);

console.log(`Total Raw: ${totalRaw}`);

const baseElement = 45;
const elementMultiplier = 1.2 * 1.2 * 1.2;
const flatElement = 8 + 6;
const totalElement = Math.floor((baseElement * elementMultiplier) + flatElement + 0.1);

console.log(`Total Element: ${totalElement}`);

// Damage Calculations
const criticalRange: 0.8 | 1 | 0.2 | 1.15 = 1; // Close | Normal | Far | Supercritical
const critDamage: 0.75 | 1 | 1.25 | 1.3 | 1.35 | 1.4 = 1.4; // Negative Crit | No Crit | Normal Crit | CB1 | CB2 | CB3
const coating: 1 | 1.2 | 1.3 | 1.35 = 1.3; // No Coating | Close Range | Bladescale Hone | Power
const rawChargeLevel: 0.65 | 1 | 1.25 | 1.35 = 1.35;
const motionValue = 0.1;
const rawHitZone = 0.6;
const antiSpecies = 1; // Still need to work this one out
const shotTypeUp: 1 | 1.05 | 1.1 | 1.2 = 1.2;

const rawDamage = Math.round(totalRaw * criticalRange * critDamage * coating * rawChargeLevel * motionValue * rawHitZone * antiSpecies * shotTypeUp);

console.log(`Raw Damage: ${rawDamage}`);

const critElement: 1 | 1.05 | 1.1 | 1.15 = 1.15;
const elementChargeLevel: 0.8 | 1 | 1.1 | 1.2 = 1.2; // Based on charge level
const elementHitZone = 0.2;
const elementExploit = 1.1; // Elembane and Element Exploit are additive
let elementDamage = monsterHunterRound(totalElement * critElement * elementChargeLevel * elementHitZone * elementExploit);

console.log(`Elemental Damage: ${elementDamage}`);

const totalDamage = rawDamage + elementDamage;
console.log(`Total Damage: ${totalDamage}`);

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