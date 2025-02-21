import text from "./PMC.vue.html?raw";

const VISIBLE = "top: -150px;";
const NOT_VISIBLE = "top: -38px;";

export const PowerMeterCalc = () => new Vue({
    el: "#yh-root",
    data: function data() {return {
        message: "Hello Vue!",
        items: [],
        calcInfos: [],
        dmgInfos: [],
        isVisible: false,
        containerStyle: "display: none;",
        rootStyle: NOT_VISIBLE,
        keysPressed: {},
    }},
    template: text,
    methods: {
        addToList: function(e) {
            const calcInfo = JSON.parse(sessionStorage.calculator);
            this.calcInfos.push(calcInfo);
            this.dmgInfos.push(calculator.$data.damage);

            const display_str = `
            ${calcInfo.attacker.unit.units_name}(${calcInfo.attacker.hp})
                vs
            ${calcInfo.defender.unit.units_name}(${calcInfo.defender.hp})
            `;
            const title_str = `    Attaker Power Gain: ${JSON.stringify(atkPMGain(calculator.$data.damage))}
Defender Power Gain: ${JSON.stringify(defPMGain(calculator.$data.damage))}`;
            this.items.unshift([display_str, title_str]);
        },
        togglePm: function(e) {
            this.isVisible = !this.isVisible;
            // This is disgusting, sorry
            if (this.isVisible) {
                this.rootStyle = VISIBLE;
                this.containerStyle = "display: block;"
            } else {
                this.rootStyle = NOT_VISIBLE
                this.containerStyle = "display: none;"
            }
            e.preventDefault();
        },
        clearList: function(e) {
            this.items = [];
            this.calcInfos = [];
            this.dmgInfos = [];
        },
        totalAtkPMGain: function() {
            const total = this.dmgInfos.reduce((acc, v) => atkPMGain(v, acc), [0, 0]);
            return JSON.stringify(total);
        },
        totalDefPMGain: function() {
            const total = this.dmgInfos.reduce((acc, v) => defPMGain(v, acc), [0, 0]);
            return JSON.stringify(total);
        },
    },
    mounted: function() {
        document.addEventListener('keydown', (e) => {
            let el = document.getElementsByClassName('calc-content');
            if (el.length === 0) {
                return;
            }
            
            if (e.key == 'X') {
                this.calcInfos.shift();
                this.dmgInfos.shift();
                this.items.shift();
            } else if (e.key == 'x') {
                this.addToList();
            }
         });
    }
});

function atkPMGain(v, acc = [0, 0]) {
    return [
        acc[0]
        + v.minCounterInfo.minLuck.counterFundsDamage
        + (v.minInfo.fundsDamage / 2),
        acc[1]
        + v.maxCounterInfo.maxLuck.counterFundsDamage
        + (v.maxInfo.fundsDamage / 2),
    ];
}

function defPMGain(v, acc = [0, 0]) {
    return [
        acc[0]
        + v.minCounterInfo.minLuck.counterFundsDamage / 2
        + (v.minInfo.fundsDamage),
        acc[1]
        + v.maxCounterInfo.maxLuck.counterFundsDamage / 2
        + (v.maxInfo.fundsDamage),
    ];
}
