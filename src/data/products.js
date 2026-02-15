import InsectocapturadorEncendido from '../assets/images/Insectocapturador-Industrial-Encendido.webp';
import InsectocapturadorApagado from '../assets/images/Insectocapturador-Industrial-Apagado.webp';
import InsectocutorEncendido from '../assets/images/Insectocutor-Encendido.webp';
import InsectocutorApagado from '../assets/images/Insectocutor-Apagado.webp';
import FluorescentesUV from '../assets/images/Fluorescentes-UV.webp';
import FluorescenteUVA20W from '../assets/images/Fluorescente-UV-A-20W.webp';
import FluorescenteUVA15W from '../assets/images/Fluorescente-UV-A-15W.webp';
import TrampasAdhesivas from '../assets/images/Trampas-Adhesivas.webp';
import TrampaAdhesivaNegra from '../assets/images/Trampa-Adhesiva-Negra.webp';
import TrampaAdhesivaAmarilla from '../assets/images/Trampa-Adhesiva-Amarilla.webp';
import BalastroElectronico from '../assets/images/Balastro-electronico.webp';

export const products = [
    { 
        id: 'trampas-luz-uv-para-insectos',
        name: "Flash Killer 20W", 
        subtitle: "Trampa de Luz UV con Placa Adhesiva",
        spec: "Trampa Adhesiva UV | Cobertura 120m²",
        desc: "Las trampas de luz UV son un eficiente y seguro dispositivo orientado a la captura, control y monitoreo de insectos voladores en áreas sensibles. Silenciosas e higiénicas.",
        images: [
            InsectocapturadorEncendido,
            InsectocapturadorApagado
        ],
        specs: [
            { label: "Material", value: "Acero Inoxidable 304 Mate" },
            { label: "Dimensiones", value: "61 x 30 x 7 cm" },
            { label: "Voltaje", value: "220V, 60 Hz" },
            { label: "Cobertura", value: "120 m²" },
            { label: "Tubos", value: "2 x 20 Watts UV" },
            { label: "Peso", value: "3 Kg" }
        ],
        safety: ["No tóxico", "Sin químicos", "Apagar antes de limpiar"]
    },
    { 
        id: 'insectocutor-industrial',
        name: "Insectocutor", 
        subtitle: "Barras Electroshock | Acero Inoxidable",
        spec: "Barras Electroshock | Acero Inoxidable",
        desc: "Alta potencia de choque. Ideales para almacenes y zonas de carga. 2500 miliamperios en barras.",
        images: [
            InsectocutorEncendido,
            InsectocutorApagado
        ],
        specs: [
            { label: "Material", value: "Acero Inoxidable C-304 certificada" },
            { label: "Dimensiones", value: "25 x 63 x 6 cm" },
            { label: "Voltaje", value: "220V / 60 Hz" },
            { label: "Cobertura", value: "120 m² sin obstáculos" },
            { label: "Tubos", value: "2 x 20 Watts UV" },
            { label: "Balastro", value: "Electrónico 2x20w" }
        ],
        safety: ["Voltaje solo para insectos voladores", "Usar zapatos dieléctricos para instalación"]
    },
    { 
        id: 'fluorescentes-uv-matamoscas',
        name: "Tubos de Luz Ultravioleta", 
        subtitle: "Repuestos FK-20 | Vida útil 8000h",
        spec: "Repuestos FK-20 | Vida útil 8000h",
        desc: "Dispositivos emisores de luz ultravioleta diseñados para ser usados en trampas de luz. Fabricados para funcionar 24/7.",
        images: [
            FluorescentesUV,
            FluorescenteUVA20W,
            FluorescenteUVA15W
        ],
        specs: [
            { label: "Largo", value: "60 cm" },
            { label: "Diámetro", value: "3 cm (T8)" },
            { label: "Consumo", value: "40 Watts" },
            { label: "Vida Útil", value: "8000 horas" }
        ],
        safety: ["No quemar", "No tirar al agua/mar"]
    },
    { 
        id: 'trampas-adhesivas-para-insectos',
        name: "Placas Adhesivas FKY/FKB", 
        subtitle: "Insumos FKY/FKB | 100% Inerte",
        spec: "Insumos FKY/FKB | 100% Inerte",
        desc: "Trampas de pegamento de cartón con una duración promedio de 60/90 días. Adhesivo 100% inerte, sin tóxicos.",
        images: [
            TrampasAdhesivas,
            TrampaAdhesivaNegra,
            TrampaAdhesivaAmarilla
        ],
        specs: [
            { label: "Dimensiones", value: "0.50 x 0.29 cm" },
            { label: "Presentación", value: "12 Pz" },
            { label: "Color", value: "Amarillo (FKY) / Negro (FKB)" },
            { label: "Cambio", value: "20-30 días (Verano), 30-45 días (Invierno)" }
        ],
        safety: ["No tóxico", "No ingerir", "Uso solo personal técnico"]
    },
    { 
        id: 'balastros-electricos-lamparas-uv',
        name: "Balastros Eléctricos", 
        subtitle: "Componentes de Ingeniería | Estabilidad UV",
        spec: "Repuestos 30W/40W | Estabilidad Eléctrica",
        desc: "Los balastros eléctricos son fundamentales para garantizar la estabilidad eléctrica y la vida útil de sus lámparas UV. Diseñados específicamente para funcionar en condiciones industriales 24/7.",
        images: [
            BalastroElectronico
        ],
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
        ]
    }
];
