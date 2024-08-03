import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { generateObject } from 'ai';
import { z } from 'zod';

import { transformStructure} from "@/helpers/transformStructure"

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const slideSchema = z.object({
      data: z.array(z.object({id: z.string(),title: z.string(), left: z.string().optional(), right: z.string().optional(), source: z.string()}))
      
    });

    const { object } = await generateObject({
      maxTokens: 500,
      model: openai("gpt-4o-mini"),
      schema: slideSchema,
      system: `Eres experto en estructura de datos e información sobre cualquier tema, también sabes hacer buenos resúmenes.

Se te proveerá un tema, cualquiera, puede ser: naturaleza, fotosíntesis, conceptos de programación, un framework web como react, o algún concepto matemático, cualquier tema.

Debes proveerme información sobre este tema, para poder crear un slide presentación, por favor genera 6 slides como maximo.



esto es un ejemplo:
data: [
    {
      id: "01"
      title: "React concepts"
      right: "02",
      source: 'React es una biblioteca de JavaScript para construir interfaces de usuario. Fue desarrollada por Facebook y se utiliza para crear aplicaciones web de una sola página, donde se necesita una experiencia de usuario fluida y rápida. React permite a los desarrolladores crear componentes reutilizables que gestionan su propio estado.'
    },
    {
      title: "Componente",
      id: "02"
      left: '01',
      right: '03',
      source: 'Los componentes en React son las piezas fundamentales de una aplicación. Cada componente puede ser una clase o una función y puede recibir propiedades (props) para personalizar su comportamiento. Los componentes pueden ser anidados, lo que permite construir interfaces complejas a partir de componentes simples.'
    },
    {
      id: "03",
      title: "useState",
      left: '02',
      source: 'El estado (state) en React es un objeto que representa la parte de la aplicación que puede cambiar. Cada componente puede tener su propio estado, y cuando este cambia, React vuelve a renderizar el componente para reflejar los cambios. Esto permite crear aplicaciones interactivas y dinámicas.'
    },
    
  ]

source es la información
right es un id
left es un id también

Este es un ejemplo:
right es el id del siguiente slide.
source es la información
left es el id del slide anterior

`,
      prompt: prompt,
    });




const resp = transformStructure(object.data)

    return NextResponse.json({ data: resp, success: true });
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}
