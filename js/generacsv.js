document.addEventListener('DOMContentLoaded', () => {

            // --- Lógica del CSV (Adaptada del código proporcionado) ---
            
            const form = document.getElementById('formulario-datos');
            const successMessage = document.getElementById('mensaje-exito');

            if (!form || !successMessage) {
                console.error("Error al iniciar: No se encontró 'formulario-datos' o 'mensaje-exito'.");
                return;
            }

            // Variable para rastrear si se encontró algún dato no vacío
            let dataFound = false;

            /**
             * Muestra un mensaje temporal con estilos de éxito.
             */
            function displaySuccessMessage(message) {
                successMessage.textContent = message;
                successMessage.classList.remove('error-style');
                successMessage.classList.add('success-style');
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    successMessage.textContent = '';
                }, 5000);
            }

            /**
             * Muestra un mensaje temporal con estilos de error.
             */
            function displayErrorMessage(message) {
                successMessage.textContent = message;
                successMessage.classList.remove('success-style');
                successMessage.classList.add('error-style');
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    successMessage.textContent = '';
                }, 5000);
            }

            /**
             * Maneja el evento de envío del formulario.
             * Recolecta los datos de los inputs, genera el CSV o muestra error.
             */
            function handleFormSubmit(event) {
                event.preventDefault();

                // Reiniciar la bandera de datos encontrados
                dataFound = false;

                // 1. RECOLECCIÓN DE DATOS Y ETIQUETAS
                const inputs = form.querySelectorAll('input[type="text"], input[type="number"]');

                let headers = [];
                let values = [];

                inputs.forEach(input => {
                    const headerName = input.getAttribute('data-label') || input.id;
                    let value = input.value.trim().replace(/"/g, '""');

                    // 1.1. COMPROBACIÓN CLAVE: Si el valor no está vacío, marcar dataFound como true
                    if (value !== "") {
                        dataFound = true;
                    }
                    
                    // Sanitización para CSV
                    if (value.includes(',') || value.includes(' ') || value.includes('\n')) {
                        value = `"${value}"`;
                    }

                    headers.push(headerName);
                    values.push(value);
                });

                // 2. VERIFICACIÓN: Si no se encontró NINGÚN dato, mostrar error y detener la descarga
                if (!dataFound) {
                    displayErrorMessage("No se ha ingresado ningún dato en el formulario.");
                    return; // Detiene la función aquí
                }
                
                // Si hay datos, continuar con la descarga

                // 3. GENERACIÓN DEL CONTENIDO CSV
                const csvHeaders = headers.join(',');
                const csvValues = values.join(',');
                const csvContent = `\uFEFF${csvHeaders}\n${csvValues}`;

                // 4. CREACIÓN Y DESCARGA DEL ARCHIVO
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                const idExoplaneta = document.getElementById('id-exoplaneta')?.value.trim() || 'Nuevo-Exoplaneta';
                link.setAttribute('download', `${idExoplaneta.replace(/[^a-zA-Z0-9-]/g, '_')}_Datos.csv`);

                document.body.appendChild(link);
                link.click();

                // Limpieza
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                // 5. MOSTRAR MENSAJE DE ÉXITO
                displaySuccessMessage(`CSV para '${idExoplaneta}' descargado exitosamente.`);
            }

            // Asigna el manejador de eventos al formulario
            form.addEventListener('submit', handleFormSubmit);

            // Agregamos un listener para limpiar el mensaje
            form.addEventListener('input', () => {
                if (successMessage.style.display !== 'none') {
                    successMessage.style.display = 'none';
                    successMessage.textContent = '';
                    successMessage.classList.remove('success-style', 'error-style');
                }
            });

            // --- Lógica de la Animación de Fondo (sin cambios) ---
            const animationContainer = document.getElementById('animation-container');

            function createStar(className, duration, count) {
                for (let i = 0; i < count; i++) {
                    const star = document.createElement('div');
                    star.className = className;
                    const startX = Math.random() * window.innerWidth;
                    const startY = Math.random() * window.innerHeight;
                    star.style.setProperty('--start-x', `${startX}px`);
                    star.style.setProperty('--start-y', `${startY}px`);
                    star.style.animationDuration = `${duration}s`;

                    if (className === 'shooting-star') {
                        const endX = startX + 500 * (Math.random() > 0.5 ? 1 : -1);
                        const endY = startY + 500 * (Math.random() > 0.5 ? 1 : -1);
                        star.style.setProperty('--end-x', `${endX}px`);
                        star.style.setProperty('--end-y', `${endY}px`);
                        star.style.animationDelay = `${Math.random() * 5}s`;
                    } else if (className === 'firefly') {
                        star.style.setProperty('--firefly-x', `${startX}px`);
                        star.style.setProperty('--firefly-y', `${startY}px`);
                        star.style.setProperty('--move-x1', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--move-y1', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--move-x2', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--move-y2', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--move-x3', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--move-y3', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--move-x4', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--move-y4', `${(Math.random() - 0.5) * 100}px`);
                        star.style.setProperty('--blink-delay', `${Math.random() * 3}s`);
                    }

                    animationContainer.appendChild(star);

                    star.addEventListener('animationend', () => {
                        if (className === 'shooting-star') {
                            star.remove();
                            setTimeout(() => createStar(className, duration, 1), 100); 
                        }
                    });
                }
            }

            createStar('shooting-star', 2.5, 10); 
            createStar('firefly', 15, 30); 

        });