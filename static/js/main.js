// buscamos el elemento "output"
const output = document.getElementById("output")

// inicializamos codemirror y le pasamos la configuracion para soportar Python con el tema dracula
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: {
    name: "python",
    version: 3,
    singleLineStringErrors: false,
  },
  theme: "dracula",
  lineNumbers: true,
  indentUnit: 4,
  matchBrackets: true,
})

// pre establecemos los valores iniciales para el codigo inicial de python que aparecera en el editor
editor.setValue("print(nombre)")
output.value = "Initializing...\n"

// agregamos lo retornado por pyodide a la salida
function addToOutput(stdout) {
  output.value += ">>> " + "\n" + stdout + "\n"
}

// funcion para limpiar la salida
function clearHistory() {
  output.value = ""
}

// inicializamos pyodide y mostramos sys.version cuando termine de cargar satisfactoriamente
async function main() {
  let pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/",
  })
  output.value = pyodide.runPython(`
    import sys
    sys.version
  `)
  output.value += "\n" + "Python Listo !" + "\n"
  return pyodide
}

// ejecuta la funcion main
let pyodideReadyPromise = main()

// le pasa el texto del editor a la funcion de pyodide.runPython y muestra el resultado en el elemento de salida
async function evaluatePython() {
  let pyodide = await pyodideReadyPromise
  try {
    pyodide.runPython(`
      import io
      sys.stdout = io.StringIO()
    `)
    let result = pyodide.runPython(editor.getValue())
    let stdout = pyodide.runPython("sys.stdout.getvalue()")
    addToOutput(stdout)
  } catch (err) {
    addToOutput(err)
  }
}
