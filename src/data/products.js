import InsectocapturadorEncendido from '../assets/images/Insectocapturador-Industrial-Encendido.webp';
import InsectocapturadorApagado from '../assets/images/Insectocapturador-Industrial-Apagado.webp';
import InsectocutorEncendido from '../assets/images/Insectocutor-Encendido.webp';
import InsectocutorApagado from '../assets/images/Insectocutor-Apagado.webp';
import InsectocapturadorTrapecio from '../assets/images/Insectocapturador-Trapecio.webp';
import InsectocapturadorPollo from '../assets/images/Insectocapturador-Pollo.webp';
import FluorescentesUV from '../assets/images/Fluorescentes-UV.webp';
import FluorescenteUVA20W from '../assets/images/Fluorescente-UV-A-20W.webp';
import FluorescenteUVA15W from '../assets/images/Fluorescente-UV-A-15W.webp';
import TrampasAdhesivas from '../assets/images/Trampas-Adhesivas.webp';
import TrampaAdhesivaNegra from '../assets/images/Trampa-Adhesiva-Negra.webp';
import TrampaAdhesivaAmarilla from '../assets/images/Trampa-Adhesiva-Amarilla.webp';
import BalastroElectronico from '../assets/images/Balastro-electronico.webp';

/**
 * @typedef {{ label: string, value: string }} ProductSpec
 * @typedef {import('astro').ImageMetadata} ProductImage
 * @typedef {{
 *   id: string,
 *   name: string,
 *   subtitle: string,
 *   spec: string,
 *   metaDescription: string,
 *   desc: string | string[],
 *   images: ProductImage[],
 *   pdf: string,
 *   specs: ProductSpec[],
 *   safety: string[],
 *   price: string,
 *   imageAlt?: string,
 *   imageAlts?: string[]
 * }} Product
 */

/** @type {Product[]} */
export const products = [
    { 
        id: 'trampas-luz-uv-para-insectos',
        name: "Capturador FK 20W", 
        subtitle: "Insectocapturador de Luz UV con Placa Adhesiva",
        spec: "Trampa adhesiva con Luz UV | Cobertura 120m²",
        imageAlt: "Trampa de luz UV Flash Killer 20W de acero inoxidable encendida",
        imageAlts: [
            "Vista frontal de la trampa de luz UV encendida demostrando su intensa luz UV",
            "Vista frontal de la trampa de luz UV apagada mostrando su acabado en acero inoxidable"
        ],
        metaDescription: "Atrapador de insectos UV de 20W en acero inoxidable 304. Captura higiénica y silenciosa de insectos voladores. Ideal para auditorías HACCP y DIGESA en Perú.",
        desc: [
            "Proteja áreas sensibles con nuestras trampas de luz UV para insectos, un dispositivo eficiente y seguro para la captura, control y monitoreo de insectos voladores.",
            "Su diseño ligero y resistente permite instalarlo fijándolo a la pared o como un colgante a una altura entre 1.8 y 2.5 metros.",
            "Este dispositivo silencioso e higiénico es ideal para la industria alimentaria, cumpliendo con estrictos controles sanitarios y normativas de organizaciones como DIGESA o HACCP."
        ],
        images: [
            InsectocapturadorEncendido,
            InsectocapturadorApagado
        ],
        pdf: "/fichas-tecnicas/capturador.pdf",
        specs: [
            { label: "Material", value: "Acero Inoxidable 304 Mate" },
            { label: "Dimensiones", value: "61 x 30 x 7 cm" },
            { label: "Voltaje", value: "220V, 60 Hz" },
            { label: "Cobertura", value: "120 m²" },
            { label: "Tubos", value: "2 x 20 Watts UV" },
            { label: "Peso", value: "3 Kg" }
        ],
        safety: ["No tóxico", "Sin químicos", "Apagar antes de limpiar"],
        price: "377.60"
    },
    { 
        id: 'insectocutor-industrial',
        name: "Insectocutor FK", 
        subtitle: "Insectocutor Industrial",
        spec: "Barras Electroshock | Acero Inoxidable",
        imageAlt: "Equipo Insectocutor FK industrial con barras de electroshock",
        imageAlts: [
            "Equipo Insectocutor FK industrial encendido con luz UV-A",
            "Insectocutor FK industrial apagado mostrando las barras metálicas"
        ],
        metaDescription: "Insectocutor industrial de acero inoxidable C-304. Alta potencia de choque de 2500mA para control de plagas en almacenes y zonas de carga en Perú.",
        desc: [
            "Proteja sus procesos de desinsectación con esta trampa eléctrica para insectos FK, construida en resistente acero inoxidable 304.",
            "Este equipo cuenta con bandejas recolectoras de insectos muertos para una mayor higiene y ofrece una alta potencia de choque con 2500 miliamperios en barras, ideal para almacenes y zonas de carga.",
            "Su diseño colgante permite fijarlo a la pared o instalarlo fácilmente, cubriendo hasta 80 metros cuadrados sin obstáculos."
        ],
        images: [
            InsectocutorEncendido,
            InsectocutorApagado
        ],
        pdf: "/fichas-tecnicas/insectocutores.pdf",
        specs: [
            { label: "Material", value: "Acero Inoxidable C-304 certificada" },
            { label: "Dimensiones", value: "25 x 63 x 6 cm" },
            { label: "Voltaje", value: "220V / 60 Hz" },
            { label: "Cobertura", value: "120 m² sin obstáculos" },
            { label: "Tubos", value: "2 x 20 Watts UV" },
            { label: "Balastro", value: "Electrónico 2x20w" }
        ],
        safety: ["Voltaje solo para insectos voladores", "Usar zapatos dieléctricos para instalación"],
        price: "180.00"
    },
    { 
        id: 'trampas-luz-uv-decorativas',
        name: "Capturador Decorativo", 
        subtitle: "Trampa de Luz UV Decorativa con Placa Adhesiva",
        spec: "Trampa Decorativa UV Adhesiva | Cobertura 80 m²",
        imageAlt: "Capturador decorativo de insectos en acero inoxidable",
        imageAlts: [
            "Trampa de luz UV decorativa modelo Trapecio",
            "Trampa de luz UV decorativa modelo Pollo para áreas comerciales"
        ],
        metaDescription: "Trampa de luz UV Flash Killer con diseño decorativo. Captura higiénica de insectos voladores. Ideal para auditorías HACCP y DIGESA en Perú.",
        desc: [
            "Las trampas de luz UV decorativas no disrumpen el diseño de sus espacios y son igual de eficientes para la captura, control y monitoreo de insectos voladores en áreas sensibles.",
            "Diseñadas para ser silenciosas e higiénicas."
        ],
        images: [
            InsectocapturadorTrapecio,
            InsectocapturadorPollo
        ],
        pdf: "/fichas-tecnicas/capturador-decorativo.pdf",
        specs: [
            { label: "Material", value: "Acero Inoxidable 304 Mate" },
            { label: "Dimensiones", value: "49 x 49 x 19 cm" },
            { label: "Voltaje", value: "220V, 50 Hz" },
            { label: "Cobertura", value: "80 m²" },
            { label: "Tubos", value: "Fluorescentes UV-A" },
            { label: "Balastro", value: "1 x 2 de 10 Watts" },
            { label: "Peso", value: "Variable" }
        ],
        safety: ["No tóxico", "Sin químicos", "Apagar antes de limpiar"],
        price: "400.00"
    },
    { 
        id: 'fluorescentes-uv-matamoscas',
        name: "Tubos de Luz Ultravioleta", 
        subtitle: "Repuestos FK-20 | Vida útil 8000h",
        spec: "Lámparas de luz UV-A inastillables | Vida útil 8000h",
        metaDescription: "Tubos de luz ultravioleta UV-A para trampas de insectos. Repuestos FK-20 de alta eficiencia con vida útil de 8000h. Compatibles con equipos industriales 24/7.",
        desc: [
            "Fluorescentes emisores de luz ultravioleta diseñados para atraer insectos voladores en un área de hasta 120 metros cuadrados.",
            "Fabricados para funcionar 24/7 por hasta 8000 horas."
        ],
        images: [
            FluorescentesUV,
            FluorescenteUVA20W,
            FluorescenteUVA15W
        ],
        pdf: "/fichas-tecnicas/fluorescentes.pdf",
        specs: [
            { label: "Largo", value: "60 cm" },
            { label: "Diámetro", value: "3 cm (T8)" },
            { label: "Consumo", value: "40 Watts" },
            { label: "Vida Útil", value: "8000 horas" }
        ],
        safety: ["No quemar", "No tirar al agua/mar"],
        price: "35.00"
    },
    { 
        id: 'trampas-adhesivas-para-insectos',
        name: "Placas Adhesivas FKY/FKB", 
        subtitle: "Insumos FKY/FKB | 100% Inerte",
        spec: "Insumos FKY/FKB | 100% Inerte",
        imageAlt: "Placas adhesivas amarillas y negras para trampas de luz UV",
        metaDescription: "Placas adhesivas FKY/FKB para captura de insectos. Insumos 100% inertes y no tóxicos. Repuestos certificados para mantenimiento de trampas de luz UV en Perú.",
        desc: [
            "Trampas de pegamento para atrapar insectos con una duración promedio de 60/90 días.",
            "Adhesivo 100% inerte, sin tóxicos.",
            "Cuerpo de cartón para fácil manipulación y reemplazo."
        ],
        images: [
            TrampasAdhesivas,
            TrampaAdhesivaNegra,
            TrampaAdhesivaAmarilla
        ],
        pdf: "/fichas-tecnicas/balastros-y-laminas.pdf",
        specs: [
            { label: "Dimensiones", value: "0.50 x 0.29 cm" },
            { label: "Presentación", value: "12 Pz" },
            { label: "Color", value: "Amarillo (FKY) / Negro (FKB)" },
            { label: "Cambio", value: "20-30 días (Verano), 30-45 días (Invierno)" }
        ],
        safety: ["No tóxico", "No ingerir", "Uso solo personal técnico"],
        price: "4.72"
    },
    { 
        id: 'balastros-electricos-lamparas-uv',
        name: "Balastros Eléctricos", 
        subtitle: "Componentes de Ingeniería | Estabilidad UV",
        spec: "Repuestos 30W/40W | Estabilidad Eléctrica",
        imageAlt: "Balastro electrónico para equipos de luz UV industrial",
        metaDescription: "Balastros electrónicos para lámparas UV industriales. Garantizan estabilidad eléctrica y maximizan la vida útil de sus equipos de captura de insectos Flash Killer.",
        desc: [
            "Los balastros eléctricos son fundamentales para garantizar la estabilidad eléctrica y la vida útil de sus lámparas UV.",
            "Diseñados específicamente para funcionar en condiciones industriales 24/7."
        ],
        images: [
            BalastroElectronico
        ],
        pdf: "/fichas-tecnicas/balastros-y-laminas.pdf",
        specs: [
            { label: "Potencia", value: "30W / 40W" },
            { label: "Tipo", value: "Balastro Electrónico" },
            { label: "Compatibilidad", value: "Lámparas UV T8 / T12" },
            { label: "Frecuencia", value: "50/60 Hz" },
            { label: "Material", value: "Carcasa Termoplástica" }
        ],
        safety: [
            "Protección contra sobretensiones",
            "Encendido instantáneo sin parpadeo",
            "Alta eficiencia energética",
            "Baja emisión de calor"
        ],
        price: "35.00"
    }
];
