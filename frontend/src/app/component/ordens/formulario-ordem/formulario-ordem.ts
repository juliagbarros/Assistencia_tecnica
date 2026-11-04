
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

import {
    OrdemServico,
    DadosOrdem
} from '../orderns-service';

import { TecnicoService } from '../../tecnicos/tecnico-service';
import { AparelhoService } from '../../aparelhos/aparelhos-service';

@Component({
    selector: 'app-formulario-ordem',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-ordem.html',
    styleUrl: './formulario-ordem.scss'
})
export class FormularioOrdem {

    private readonly aparelhoService = inject(AparelhoService);
    private readonly tecnicoService = inject(TecnicoService);

    readonly aparelhos = this.aparelhoService.listar();
    readonly tecnicos = this.tecnicoService.listar();

    ordem = input<OrdemServico | null>(null);

    salvar = output<DadosOrdem>();
    cancelar = output<void>();

    readonly formulario = new FormGroup({
        aparelhoId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        tecnicoId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        defeitoRelatado: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        diagnostico: new FormControl('', {
            nonNullable: true
        }),
        situacao: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        dataAbertura: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        dataConclusao: new FormControl('', {
            nonNullable: true
        }),
        dataEntrega: new FormControl('', {
            nonNullable: true
        })
    });

    constructor() {
        this.aparelhoService.carregar();
        this.tecnicoService.carregar();

        effect(() => {
            const ordem = this.ordem();

            this.formulario.reset({
                aparelhoId: ordem?.aparelho?.id ?? null,
                tecnicoId: ordem?.tecnico?.id ?? null,
                defeitoRelatado: ordem?.defeitoRelatado ?? '',
                diagnostico: ordem?.diagnostico ?? '',
                situacao: ordem?.situacao ?? '',
                dataAbertura: ordem?.dataAbertura?.slice(0, 16) ?? '',
                dataConclusao: ordem?.dataConclusao?.slice(0, 16) ?? '',
                dataEntrega: ordem?.dataEntrega?.slice(0, 16) ?? ''
            });
        });
    }

    private formatarData(valor: string): string | null {
        if (!valor) {
            return null;
        }

        return valor.length === 16 ? `${valor}:00` : valor;
    }

    enviar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const dados = this.formulario.getRawValue();

        if (dados.aparelhoId === null || dados.tecnicoId === null) {
            return;
        }

        const dataAbertura = this.formatarData(dados.dataAbertura);

        if (!dataAbertura) {
            return;
        }

    this.salvar.emit({
        aparelhoId: dados.aparelhoId,
        tecnicoId: dados.tecnicoId,
        defeitoRelatado: dados.defeitoRelatado,
        diagnostico: dados.diagnostico || null,
        situacao: dados.situacao.trim(),
        dataAbertura,
        dataConclusao: this.formatarData(dados.dataConclusao),
        dataEntrega: this.formatarData(dados.dataEntrega)
    });
    }
}
