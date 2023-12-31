import React, {useState} from "react";
import {createRoot} from "react-dom/client"

function App() {
    return (
        <div>Damage Calculator</div>
    )
}
const el = document.getElementById("app")
const app = createRoot(el)
app.render(<App/>);