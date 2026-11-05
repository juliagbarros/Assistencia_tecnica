
import {
    Component,
    OnInit,
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

import { ServicoService } from '../../../servico/servico-service';

import {
    ItemOrdem,
    DadosItemOrdem
} from '../../item-ordem-service';

@Component({
    selector: 'app-formulario-item-ordem',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-item-ordem.html',
    styleUrl: './formulario-item-ordem.scss'
})
export class FormularioItemOrdem implements OnInit {

    private readonly servicoService = inject(ServicoService);

    readonly servicos = this.servicoService.listar();

    readonly ordemId = input.required<number>();
    readonly item = input<ItemOrdem | null>(null);

    readonly salvar = output<DadosItemOrdem>();
    readonly cancelar = output<void>();

    readonly formulario = new FormGroup({
        servicoId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),

        quantidade: new FormControl(1, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(1),
                Validators.pattern(/^[1-9]\d*$/)
            ]
        }),

        precoUnitario: new FormControl(0, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(0)
            ]
        })
    });

    constructor() {
        effect(() => {
            const item = this.item();

            this.formulario.reset({
                servicoId: item?.servicoId ?? null,
                quantidade: item?.quantidade ?? 1,
                precoUnitario: item?.precoUnitario ?? 0
            });
        });
    }

    ngOnInit(): void {
        this.servicoService.listar();
    }

    selecionarServico(): void {
        const servicoId = this.formulario.controls.servicoId.value;

        const servico = this.servicos().find(
            servico => servico.id === servicoId
        );

        if (servico) {
            this.formulario.controls.precoUnitario.setValue(
                servico.precoPadrao
            );
        }
    }

    formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    enviar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const dados = this.formulario.getRawValue();

        if (dados.servicoId === null) {
            return;
        }

        const servico = this.servicos().find(
            servico => servico.id === dados.servicoId
        );

        const nomeServico = servico?.nome ??
            this.item()?.servicoNome;

        if (!nomeServico) {
            return;
        }

        this.salvar.emit({
            ordemId: this.ordemId(),
            servicoId: dados.servicoId,
            quantidade: dados.quantidade,
            precoUnitario: dados.precoUnitario
        });
    }
}
