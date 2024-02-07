import React, {useState, useEffect} from "react";
import {createRoot} from "react-dom/client"

function usePokemon(name, allPokemon) {
    const [data, setData] = useState({
        name, 
        species: null,
        type: null,
        ability: null,
        ivs: {},
        evs: {},
    })

    function getPokemonWithDefaults(name) {
        const species = allPokemon?.[name]
        return {
            species: {
                ...species,
                baseStats: {
                    Hp: parseInt(species.baseStats.Hp),
                    Atk: parseInt(species.baseStats.Atk),
                    Def: parseInt(species.baseStats.Def),
                    SpAtk: parseInt(species.baseStats.SpAtk),
                    SpDef: parseInt(species.baseStats.SpDef),
                    Speed: parseInt(species.baseStats.Speed),
                }
            },
            type: species.types[0],
            ability: species.abilities[0],
            ivs: {"Hp": 31, "Atk": 31, "Def": 31, "SpAtk": 31, "SpDef": 31, "Speed": 31},
            evs: {"Hp": 0, "Atk": 0, "Def": 0, "SpAtk": 0, "SpDef": 0, "Speed": 0}
        }
    }

    useEffect(() => {
        const pokemon = getPokemonWithDefaults(name)
        setData({ ...data, ...pokemon })
    }, [name])

    const editor = {
        setName: (name) => {
            const pokemon = getPokemonWithDefaults(name)
            setData({ ...data, ...pokemon, name })
        },
        setType: (type) => {
            setData({...data, type})
        },
        setAbility: (ability) => {
            setData({...data, ability})
        },
        setIV: (statName, value) => {
            setData({...data, ivs: {...data.ivs, [statName]: value} })
        },
        setEV: (statName, value) => {
            setData({...data, evs: {...data.evs, [statName]: value} })
        }
    }
    return [data, editor]
}

function BattlePokemon({ data, setSidebar }) {
    if (!data.species) return null
    console.log(data)

    const url = window.location.href + "PokemonIcons/Big/pm" + data.species.pictureID + "_big.png"

    return (
        <div className="BattlePokemon" onClick={setSidebar}>
            {/* <p>{data.name}</p> */}
            <img className="pokemonImg" src={url} />
        </div>
    )
}

function DamageOutput({ estimatedDamage, attacker, defender }) {

    const healthPct = ((estimatedDamage/defender?.species?.baseStats?.Hp) * 100).toFixed(1)
    const benchmark = Math.ceil(defender?.species?.baseStats?.Hp / estimatedDamage)
    return (
        <>
            <p className="DamageOutput">{attacker.name} will do approx. { estimatedDamage } Hit Points to { defender.name } ({healthPct}%) - {benchmark}HKO </p>
        </>
    );
}

function PokemonSelector({ allPokemon, name, setName }) {
    return (
        <select className="PokemonSelector" value={name} onChange={(e) => setName(e.target.value)}>{Object.values(allPokemon).map((p) => (
            <option key={p.name} value={p.name} >{p.name.toUpperCase()}</option>
        ))}</select>
    )
}

function calculateStat(iv, ev, base) {
    // console.log(iv, ev, base)
    return Math.floor(Math.floor(((2*base+iv+Math.floor(ev/4))*50)/100)+5)
}

function calculateDamage(power, attackingStat, defensiveStat) {
    return Math.floor(Math.floor(22*power*(attackingStat/defensiveStat))/50)
}


function Move({ move, setMove }) {

    return (
        <div>
            <div className="move1">
                <input className="moveName" type="text" placeholder={"Move 1 Name"}></input>
                <input className="movePower" type="number" value={move.power} onChange={(e) => {
                    setMove((old) => ({
                        ...old, power: parseInt(e.target.value)
                    }))
                }} />
            </div>
            <div className="move2">
                    <select className="moveType" defaultValue={"Type"}>
                        <option>Normal</option>
                        <option>Fire</option>
                        <option>Water</option>
                        <option>Electric</option>
                        <option>Grass</option>
                        <option>Ice</option>
                        <option>Fighting</option>
                        <option>Poison</option>
                        <option>Ground</option>
                        <option>Flying</option>
                        <option>Psychic</option>
                        <option>Bug</option>
                        <option>Rock</option>
                        <option>Ghost</option>
                        <option>Dragon</option>
                        <option>Dark</option>
                        <option>Steel</option>
                        <option>Fairy</option>
                    </select>
                    <select className="moveCategory" onChange={(e) => {
                        setMove((old) => ({
                            ...old, category: e.target.value
                        }))
                    }}>
                        <option>Physical</option>
                        <option>Special</option>
                    </select>
            </div>
        </div>
    )
}

function Type({ types }) {
    if (types.length == 1 ) {
        return(
            <div className="Type">
                <p>Type:</p>&nbsp;
                <div className="type1">
                    <p>{types[0]}</p>
                </div>
            </div>
        );
    }
    else {
        return( 
            <div className="Type">
                <p>Types:</p>&nbsp;
                <div className="type1">
                    <p>{types[0]}</p>
                </div>&nbsp;
                <div className="type2">
                    <p>{types[1]}</p>
                </div>
            </div>
        );
    }
}

function Stat({ statName, baseStat, iv, ev, setIV, setEV }) {
    let totalStat = calculateStat(iv, ev, baseStat)

    if (isNaN(totalStat)) {
        totalStat = calculateStat(iv, 0, baseStat)
    }

    return (
        <div className="Stat">
            <div className="stat1">
                <div className="statName">
                    <label>{ statName }:</label>
                </div>
                <div className="baseStat">
                    <label>{ baseStat } </label>
                </div>
                <input className="ivBox" type="number" value={ iv } min="0" max="31" onChange={(e) => {
                    setIV(parseInt(e.target.value))
                    }}/>
                <input className="evBox" type="number" value={ev} min={0} max={252} onChange={(e) => {   
                    let v = parseInt(e.target.value)
                    // v = isNaN(v) ? 0 : v
                    setEV(Math.min(252, v))

                }}/>
            </div>
            <div className="stat2">
                <input className="evSlider" type="range" min="0" max="252" value={ ev } step="4" onChange={(e) => {
                    setEV(parseInt(e.target.value))
                }}/>
                <select className="statChange" defaultValue={ "--" }>
                    <option>+6</option>
                    <option>+5</option>
                    <option>+4</option>
                    <option>+3</option>
                    <option>+2</option>
                    <option>+1</option>
                    <option>-6</option>
                    <option>--</option>
                    <option>-1</option>
                    <option>-2</option>
                    <option>-3</option>
                    <option>-4</option>
                    <option>-5</option>
                </select>
                <div className="totalStat">
                    <label>{ totalStat }</label>                
                </div>
            </div>
        </div>
    )
}

function Sidebar({ choice, allPokemon, move, setMove }) {
    const [data, editor] = choice

    if (!data || !editor || !data.species) { //addded !data.species
        return null
    }

    // const url = "/Pokémon Icons/Big/pm" + data.species.pictureID + "_big.png"
    const statNames = ["Hp", "Atk", "Def", "SpAtk", "SpDef", "Speed"]
    return (
        <div className="Sidebar">
            <PokemonSelector {...{ allPokemon, name: data.name, setName: editor.setName }}/>
            {/* <p>{data.name}</p> */}
            {/* <p>{data.species.types[0]} {data.species.types[1]}</p> */}
            <Type types={ data.species.types }/>
            {/* <Type type1={data.species.types[0]} type2={data.species.types[1]}></Type> */}
            <div className="statContainer">
                {statNames.map((statName) => (
                    <Stat 
                        key={ statName }
                        statName={ statName } 
                        baseStat={data.species.baseStats[statName]}
                        iv={data.ivs[statName]}
                        ev={data.evs[statName]}
                        setIV={(value) => editor.setIV( statName, value)}
                        setEV={(value) => editor.setEV( statName, value)}
                    />        
                ))}
            </div>
            <select className="natureSelector">
                <option>Nature</option>
            </select>
            <select className="abilitySelector" value={data.ability} onChange={(e) => editor.setAbility(e.target.value)}>{data.species.abilities.map((a) => (
                <option key={a} value={a} >{a}</option>
            ))}</select>
            <select className="itemSelector">
                <option>Item</option>
            </select>
            <br></br>
            <Move {...{ move, setMove }} />
            <Move {...{ move, setMove }} />
            <Move {...{ move, setMove }} />
            <Move {...{ move, setMove }} />


        </div>
    )
}

function App({ allPokemon }) {
    const [aLeft, aLeftEditor] = usePokemon("Charmander", allPokemon)
    const [aRight, aRightEditor] = usePokemon("Bulbasaur", allPokemon)
    const [bLeft, bLeftEditor] = usePokemon("Pikachu", allPokemon)
    const [bRight, bRightEditor] = usePokemon("Squirtle", allPokemon)

    const [aSelected, setASelected] = useState("left")
    const [bSelected, setBSelected] = useState("right")

    const [move, setMove] = useState({ name: "", power: 50, type: "Normal", category: "Physical" })

    const sides = {
        a: {
            left: [aLeft, aLeftEditor],
            right: [aRight, aRightEditor],
        },
        b: {
            left: [bLeft, bLeftEditor],
            right: [bRight, bRightEditor],
        }
    }

    const aChoice = sides["a"]?.[aSelected] || [{}, null]
    const bChoice = sides["b"]?.[bSelected] || [{}, null]

    const attacker = aChoice[0]
    const defender = bChoice[0]

    const attackingStat = move.category == "Physical" ? "Atk" : "SpAtk";
    const defendingStat = move.category == "Physical" ? "Def" : "SpDef";

    const estimatedDamage = calculateDamage(move.power, attacker?.species?.baseStats?.[attackingStat], defender?.species?.baseStats?.[defendingStat])
    // const estimatedDamage = calculateDamage(move.power, attacker?.species?.calculateStat(attacker.species.ivs,)?.[attackingStat], defender?.species?.baseStats?.[defendingStat])


    return (
        <>
            <Sidebar id="leftBar" {...{ choice: aChoice, allPokemon, move, setMove }} />
            <div className="display">
                <div className="team" id="teamB">
                    <BattlePokemon {...{ data: bLeft, setSidebar: () => setBSelected("left") }} />
                    <BattlePokemon {...{ data: bRight, setSidebar: () => setBSelected("right") }} />
                </div>
                <div className="team" id="teamA">
                    <BattlePokemon {...{ data: aLeft, setSidebar: () => setASelected("left") }} />
                    <BattlePokemon {...{ data: aRight, setSidebar: () => setASelected("right") }} />
                </div>
                <DamageOutput {...{ attacker, defender, estimatedDamage }} />
            </div>
            <Sidebar {...{ choice: bChoice, allPokemon, move, setMove }} />
        </>
    );
}

async function getAllPokemon() {
    const file = await fetch("pokemon.json")
    const data = await file.json()
    return data
}

async function main() {
    const allPokemon = await getAllPokemon()
    const el = document.getElementById("app")
    const app = createRoot(el)
    app.render(<App {...{ allPokemon }} />)
}

main()