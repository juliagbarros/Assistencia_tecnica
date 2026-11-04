
import {
    Component,
    effect,
    inject,
    input,
    output
} from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';



import { ClienteService } from '../../clientes/cliente-service';
import { Aparelho, DadosAparelho } from '../aparelhos-service';

@Component({
    selector: 'app-formulario-aparelho',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-aparelho.html',
    styleUrl: './formulario-aparelho.scss'
})
export class FormularioAparelho {

    private readonly clienteService = inject(ClienteService);

    readonly clientes = this.clienteService.listar();

    aparelho = input<Aparelho | null>(null);

    salvar = output<DadosAparelho>();
    cancelar = output<void>();

    readonly formulario = new FormGroup({
        clienteId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        tipo: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        marca: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        modelo: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        numeroSerie: new FormControl('', {
            nonNullable: true
        }),
        observacoes: new FormControl('', {
            nonNullable: true
        })
    });

    constructor() {
        effect(() => {
            const aparelho = this.aparelho();

            this.formulario.reset({
                clienteId: aparelho?.cliente?.id ?? null,
                tipo: aparelho?.tipo ?? '',
                marca: aparelho?.marca ?? '',
                modelo: aparelho?.modelo ?? '',
                numeroSerie: aparelho?.numeroSerie ?? '',
                observacoes: aparelho?.observacoes ?? ''
            });
        });
    }

    enviar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const dados = this.formulario.getRawValue();

        if (dados.clienteId === null) {
            return;
        }

        this.salvar.emit({
        clienteId: dados.clienteId,
        tipo: dados.tipo,
        marca: dados.marca,
        modelo: dados.modelo,
        numeroSerie: dados.numeroSerie || null,
        observacoes: dados.observacoes || null
    });
    }
}
