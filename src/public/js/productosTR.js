
const table = document.getElementById('tablaProductos')

const socket = io() 
socket.on('connect', () =>{
    console.log(socket.id);
})

socket.on('update', data => {
    table.innerHTML = 
        `<tr>
            <td>Producto</td>
            <td>Descripción</td>
            <td>Categoría</td>
            <td>Precio</td>
            <td>Stock</td>
            <td>Código</td>
        </tr>`;
        for (product of data) {
            let tr = document.createElement('tr')
            tr.innerHTML=   `   <td>${product.title}</td>
                                <td>${product.description}</td>
                                <td>${product.category}</td>
                                <td>${product.price}</td>
                                <td>${product.stock}</td>
                                <td>${product.code}</td>
                            `;
            table.getElementsByTagName('tbody')[0].appendChild(tr);
        }
           
} )


