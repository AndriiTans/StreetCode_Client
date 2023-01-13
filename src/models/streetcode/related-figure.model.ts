import Tag from "../additional-content/tag.model"
import Image from "../media/image.model"

export default interface RelatedFigure {
    id: number;
    title: string;
    imageId: number;
    tags: Tag[];
}