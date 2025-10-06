import joblib
import pandas as pd
# Asegúrate de importar render_template
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# --- CAMBIO IMPORTANTE AQUÍ ---
# Le decimos a Flask que busque los templates en el directorio actual (raíz)
app = Flask(__name__, template_folder='.')

CORS(app)

# --- Carga de Modelos (sin cambios) ---
try:
    modelo = joblib.load('modelo_kepler_equilibrado.pkl')
    escalador = joblib.load('escalador_kepler_equilibrado.pkl')
    print("Modelo y escalador cargados correctamente.")
except FileNotFoundError:
    print("Error: No se encontraron los archivos .pkl.")
    exit()

# --- RUTAS PARA SERVIR LAS PÁGINAS HTML (Ahora desde la raíz) ---

# Ruta para la página principal (index.html)
@app.route('/')
def index():
    return render_template('index.html')

# Nueva ruta para la página del formulario (formulario.html)
@app.route('/formulario')
def formulario():
    return render_template('formulario.html')

# --- ENDPOINT DE LA API PARA LA PREDICCIÓN (sin cambios) ---

COLUMNAS_ESPERADAS = [
    'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
    'koi_model_snr', 'koi_depth', 'koi_period', 'koi_duration',
    'koi_prad', 'koi_steff', 'koi_slogg', 'koi_srad'
]

@app.route('/predict', methods=['POST'])
def predecir():
    try:
        datos_entrada = request.get_json()

        if not datos_entrada:
            return jsonify({"error": "No se recibieron datos."}), 400

        if not all(columna in datos_entrada for columna in COLUMNAS_ESPERADAS):
            return jsonify({"error": "Faltan datos de entrada."}), 400

        nuevos_datos = pd.DataFrame([datos_entrada], columns=COLUMNAS_ESPERADAS)
        nuevos_datos_escalados = escalador.transform(nuevos_datos)
        prediccion_num = modelo.predict(nuevos_datos_escalados)
        probabilidades = modelo.predict_proba(nuevos_datos_escalados)
        resultado_texto = 'CONFIRMED' if prediccion_num[0] == 1 else 'FALSE POSITIVE'
        confianza = float(probabilidades[0][prediccion_num[0]])

        respuesta = {
            'prediccion': resultado_texto,
            'confianza': round(confianza, 4)
        }
        return jsonify(respuesta)

    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({"error": f"Ocurrió un error al procesar la petición: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
