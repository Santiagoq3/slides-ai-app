interface Slide {
    id: string;
    left?: string;
    right?: string;
    source: string;
    title: string;
  }
  
  interface TransformedSlide {
    title: string 
    source: string;
    left?: string;
    right?: string;
  }

  export const transformStructure = (slides: Slide[]): { [key: string]: TransformedSlide } => {
    const result: { [key: string]: TransformedSlide } = {};
  
    slides.forEach(item => {
      const { id, left, right, source, title} = item;
  
      result[id] = {
        left: left || undefined,   
        right: right || undefined,
        source: source,
        title: title
      };
    });
    return result;
  };