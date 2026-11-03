# Cuestiones finales

1. **¿Qué responsabilidad tiene GameService?**
   Construir y realizar las consultas HTTP a JSON Server (URL, parámetros, `observe`) y devolver Observables. Centraliza el acceso a datos.

2. **¿Por qué AppComponent no debería utilizar directamente HttpClient?**
   Por separación de responsabilidades: el componente solo recoge eventos y mantiene el estado de la interfaz. Si el acceso HTTP está en el servicio, se reutiliza, se prueba más fácil y si cambia la API solo se toca el servicio.

3. **Diferencia entre `GET /games` y `GET /games/5`**
   `/games` devuelve la colección completa (un array). `/games/5` devuelve un único recurso, el videojuego con `id = 5` (un objeto).

4. **¿Qué representa `?genre=RPG`?**
   Un parámetro de consulta (query string): pide a JSON Server solo los juegos cuyo campo `genre` sea `RPG`. El filtrado lo hace el servidor.

5. **¿Qué evento DOM genera un `<select>` al cambiar su selección?**
   El evento `change`.

6. **¿Cómo se captura en Angular?**
   Con event binding: `(change)="metodo(...)"`.

7. **¿Qué representa `$event`?**
   El objeto del evento DOM que se ha producido (en este caso un `Event`, cuyo `target` es el `<select>`).

8. **Ventaja de usar la referencia `#genreSelect`**
   Da acceso directo al elemento HTML en la plantilla, así se pasa `genreSelect.value` directamente como `string` sin tener que hacer `event.target as HTMLSelectElement`.

9. **Diferencia entre `title_like=Dragon` y `q=Dragon`**
   `title_like` busca coincidencias parciales solo en el campo `title`. `q` es una búsqueda global en todos los campos (por eso `q=PC` encuentra juegos por su plataforma y `q=RPG` por su género).

10. **¿Para qué sirven `_page` y `_limit`?**
    Para paginar: `_limit` indica cuántos elementos por página y `_page` qué página se quiere.

11. **¿Por qué `this.http.get<Game[]>(url)` no permite acceder a las cabeceras?**
    Porque por defecto HttpClient usa `observe: 'body'` y el Observable emite solo el cuerpo ya convertido desde JSON (el `Game[]`), descartando cabeceras y estado.

12. **¿Qué conseguimos con `observe: 'response'`?**
    Que el Observable emita la respuesta HTTP completa, un `HttpResponse<Game[]>`, con `body`, `headers` y `status`.

13. **¿Dónde están los videojuegos en un `HttpResponse<Game[]>`?**
    En `response.body` (puede ser `null`, por eso `response.body ?? []`).

14. **¿Dónde están las cabeceras HTTP?**
    En `response.headers`, se leen con `response.headers.get('Nombre')`.

15. **¿Qué información proporciona `X-Total-Count`?**
    El número total de registros que cumplen la consulta realizada (con sus filtros), no los que vienen en la página actual.

16. **¿Por qué convertir `X-Total-Count` a number?**
    Porque `headers.get()` devuelve `string | null`; para hacer cálculos (dividir, comparar) necesitamos un número: `Number(... ?? 0)`.

17. **¿Cómo calculamos el número total de páginas?**
    `Math.ceil(totalItems / pageSize)`. Ej.: 17 / 5 = 3.4 → 4 páginas.

18. **¿Por qué volver a la página 1 al modificar un filtro?**
    Porque con el nuevo filtro puede haber menos resultados y la página actual podría no existir (estar en la página 3 y que solo haya 2 juegos RPG). Reiniciar a 1 garantiza una petición válida.
