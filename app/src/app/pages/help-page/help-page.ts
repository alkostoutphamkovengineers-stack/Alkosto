import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-page',
  imports: [CommonModule],
  templateUrl: './help-page.html',
  styleUrl: './help-page.scss',
})
export class HelpPage {
  faqs = [
    {
      question: '¿Debo registrarme para poder comprar en Alkosto.com?',
      answer:
        'Sí, aunque puedes agregar los productos que quieras al carrito de compras sin estar registrado. Cuando realices el proceso de compra debes ingresar tus datos personales, así como el método de envío y tu medio de pago.',
      answerHtml: `Sí, aunque puedes agregar los productos que quieras al carrito de compras sin estar registrado. Cuando realices el proceso de compra debes ingresar tus datos personales, así como el método de envío y tu medio de pago.`,
      open: true,
    },
    {
      question: '¿Cuál es el proceso para comprar en Alkosto.com?',
      answer:
        'Selecciona el producto, agrégalo al carrito y sigue el flujo de pago donde podrás escoger envío y forma de pago.',
      answerHtml: `Para encontrar el producto que quieres tienes dos opciones:<br><br>
      <strong>Buscador:</strong> ingresa el nombre artículo que necesitas en nuestro buscador interno ubicado en la parte superior de la página web. Así podrás filtrar y ver otros productos relacionados.<br><br>
      <strong>Mapa de categorías:</strong> justo debajo del buscador encontrarás nuestras 12 categorías y las ofertas que tenemos disponibles.<br><br>
      <strong>Cuando encuentres el producto que quieres:</strong>
      <ol>
        <li>Agrega el producto al carrito de compras.</li>
        <li>Cuando estés listo, da clic en el botón ‘Ir a pagar’ ubicado dentro del carrito.</li>
        <li>Ingresa tus datos personales y los datos del domicilio a donde quieres que enviemos tu compra, o si quieres recogerla en tienda.</li>
        <li>Ingresa el medio de pago que prefieras.</li>
        <li>Confirma tu pedido y listo.</li>
      </ol>`,
      open: false,
    },
    {
      question: '¿En Alkosto.com tengo los mismos precios y descuentos que en tienda?',
      answer:
        'Los precios en línea pueden variar respecto a la tienda física. Revisa las condiciones en cada producto.',
      answerHtml: `Nuestros precios son los mismos en tiendas que en internet, la mayoría de nuestros productos los encuentras disponibles tanto en tiendas como en .com`,
      open: false,
    },
    {
      question: '¿Encuentro los mismos productos tanto en tienda física como en alkosto.com?',
      answer: 'La disponibilidad de productos puede variar entre tienda física y en línea.',
      answerHtml: `Sí, el catalogo es el mismo. Sin embargo, para recibir información sobre la disponibilidad de productos en nuestras tiendas puedes comunicarte a nuestra línea de servicio al cliente <span class="phone">(601) 4073033</span>.`,
      open: false,
    },
    {
      question: '¿Puedo devolver un producto comprado en línea?',
      answer:
        'Consulta la política de devoluciones; normalmente es posible dentro de los plazos establecidos y con la documentación requerida.',
      answerHtml: `Consulta la política de devoluciones; normalmente es posible dentro de los plazos establecidos y con la documentación requerida.`,
      open: false,
    },
    {
      question: '¿Hay restricciones en el número de artículos que puedo comprar?',
      answer:
        'Algunas promociones o productos pueden tener límites de compra; revisa las condiciones en la página del producto.',
      answerHtml:
        'Sí, la restricción se calcula por un número máximo de artículos y el valor total del pedido. En el momento de agregar los productos al carrito te informaremos si superas ese límite.',
      open: false,
    },
    {
      question: '¿Puedo hacer compras desde fuera de Colombia?',
      answer:
        'La plataforma está orientada principalmente a clientes en Colombia; verifica si tu país es soportado o si el envío internacional está disponible.',
      answerHtml:
        'Si, siempre y cuando el pago se realice con medios de pago emitidos en Colombia y se pueda validar el pago.',
      open: false,
    },
    {
      question: '¿Puedo comprar más de una unidad del mismo artículo?',
      answer:
        'Sí, por lo general puedes seleccionar la cantidad deseada, salvo restricciones puntuales por stock o promociones.',
      answerHtml: 'Sí, pero cada cliente tiene un límite de 4 unidades por producto.',
      open: false,
    },
    {
      question: '¿Puedo comprar desde el exterior para que sea enviado a Colombia?',
      answer:
        'Consulta las opciones de envío internacional y las políticas de importación; en algunos casos es posible con proveedores de logística.',
      answerHtml:
        'Aquí puedes consultar el listado completo de las ciudades y municipios en los que tenemos cobertura.',
      open: false,
    },
    {
      question: '¿Con qué medios puedo pagar?',
      answer:
        'Aceptamos tarjetas de crédito/débito, PSE y otros medios que se muestran en el checkout. Revisa las opciones disponibles al pagar.',
      answerHtml: `Tarjetas de crédito de las franquicias Visa, Mastercard o American Express de cualquier banco.<br>
      Tarjeta débito a través de PSE.<br>
      Tarjeta de crédito Alkosto.<br>
      Nequi - DaviPlata.<br>
      Bancolombia Débito y A La Mano.<br>
      Tarjeta Codensa.<br>
      Transferencias en efectivo a través de Efecty y Baloto.`,
      open: false,
    },
    {
      question: '¿Puedo utilizar más de un medio de pago para mis compras en línea?',
      answer:
        'Algunas combinaciones pueden no estar permitidas; verifica en el checkout si está disponible la opción de dividir el pago.',
      answerHtml: 'No, actualmente cada pedido solo puede ser pagado con un medio de pago.',
      open: false,
    },
    {
      question: '¿Puedo tener asesoría en el proceso de compra?',
      answer:
        'Sí, puedes contactar al servicio de atención al cliente para recibir ayuda durante el proceso de compra.',
      answerHtml:
        'Sí, si necesitas ayuda puedes comunicarte a nuestra línea de venta telefónica <span class="phone">(601) 746 8001</span>.',
      open: false,
    },
    {
      question: '¿El pago es seguro?',
      answer:
        'Sí, utilizamos protocolos de seguridad y proveedores de pago certificados para proteger tus datos.',
      answerHtml:
        'Tomamos todas las medidas de seguridad que se encuentran a nuestro alcance para garantizar la seguridad de tus compras.',
      open: false,
    },
    {
      question: '¿Si un producto presenta una falla lo puedo cambiar?',
      answer:
        'Depende de la garantía y la política de devoluciones; revisa la sección de garantías y la política de cambios.',
      answerHtml:
        'Sí, para conocer las condiciones e instrucciones para realizar un cambio te invitamos a consultar nuestra Política de Cambios y Devoluciones.',
      open: false,
    },
    {
      question: '¿A dónde me puedo comunicar si tengo una duda?',
      answer:
        'Puedes comunicarte al servicio de atención al cliente o usar los canales de contacto disponibles en la página.',
      answerHtml: `Si tienes dudas sobre productos o pedidos puedes contactarnos a través de nuestra línea de servicio al cliente <span class="phone">(601) 4073033</span>.<br>
      También puedes diligenciar este formulario <a href="https://www.alkosto.com/contacto/c/contacto" target="_blank" rel="noopener">https://www.alkosto.com/contacto/c/contacto</a>`,
      open: false,
    },
  ];

  toggle(i: number) {
    // Toggle the selected item and close others (accordion behavior)
    this.faqs = this.faqs.map((f, idx) => ({ ...f, open: idx === i ? !f.open : false }));
  }
}
