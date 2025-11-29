export class CanalResponse {
    id!: string;
    nombreCanal!: string;
    descripcion?: string | null;
    fechaCreacion!: Date;
    idCanalPadre?: string | null;
    followersCount!: number;
}
