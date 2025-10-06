import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    modelo = joblib.load('modelo_kepler_equilibrado.pkl')
    escalador = joblib.load('escalador_kepler_equilibrado.pkl')
    print("Modelo y escalador cargados correctamente.")
except FileNotFoundError:
    print("Error: Asegúrate de que los archivos 'modelo_kepler_equilibrado.pkl' y 'escalador_kepler_equilibrado.pkl' se encuentren en el mismo directorio.")
    exit()

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
            columnas_faltantes = list(set(COLUMNAS_ESPERADAS) - set(datos_entrada.keys()))
            return jsonify({
                "error": "Faltan datos de entrada.",
                "columnas_faltantes": columnas_faltantes,
                "columnas_esperadas": COLUMNAS_ESPERADAS
            }), 400

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
