
import {
    Component,
    ElementRef,
    ViewChild,
    AfterViewInit,
    input,
    output
} from '@angular/core';

@Component({
    selector: 'app-modal',
    imports: [],
    templateUrl: './modal.html',
    styleUrl: './modal.scss'
})
export class Modal implements AfterViewInit {

    titulo = input.required<string>();
    descricao = input('');

    fechar = output<void>();

    @ViewChild('dialogo')
    dialogo!: ElementRef<HTMLDialogElement>;

    ngAfterViewInit(): void {
        this.dialogo.nativeElement.showModal();
    }

    fecharModal(): void {
        this.dialogo.nativeElement.close();
    }

    clicarFora(event: MouseEvent): void {
        const dialogo = this.dialogo.nativeElement;

        if (event.target !== dialogo) return;

        const area = dialogo.getBoundingClientRect();

        const fora =
            event.clientX < area.left ||
            event.clientX > area.right ||
            event.clientY < area.top ||
            event.clientY > area.bottom;

        if (fora) {
            this.fecharModal();
        }
    }
}
