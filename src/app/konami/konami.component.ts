import {Component, OnInit, HostListener} from '@angular/core';

@Component({
  selector: 'konami',
  templateUrl: './konami.component.html',
  styleUrls: ['./konami.component.scss']
})
export class KonamiComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private konamiqueue: string[] = [];
  @HostListener('document:keyup', ['$event'])
  onGlobalKeypress(event) {
    const zettai_sequence = [
      ['ArrowUp'], // #1
      ['ArrowUp'], // #2
      ['ArrowDown'], // #3
      ['ArrowDown'], // #4
      ['ArrowLeft'], // #5
      ['ArrowRight'], // #6
      ['ArrowLeft'], // #7
      ['ArrowRight'], // #8
      ['b', 'B'], // #9
      ['a', 'A']  // #10!
    ];
    this.konamiqueue.push(event.key);
    if (this.konamiqueue.length < zettai_sequence.length)
      return;
    if (this.konamiqueue.length > zettai_sequence.length)
      this.konamiqueue.shift();
    for (let i in this.konamiqueue) {
      if (zettai_sequence[i].indexOf(this.konamiqueue[i]) === -1)
        return;
    }
    let q = window.confirm(`
         (\\_/)\u00A0\u00A0\u00A0 \u00A0 \u00A0(\\__/)\u00A0\u00A0\u00A0\u00A0 (\\_/)
       =(^.^)=\u00A0\u00A0\u00A0 (>'.'<)\u00A0\u00A0\u00A0 (o.o)
       (")_(")\u00A0\u00A0\u00A0 \u00A0(¨)_(¨)\u00A0\u00A0\u00A0 (¨)(¨)*
       
\u2610\u2610\u2610
    `);
    if (q)
      alert(`
        /|ˎ
      (˚◟ₒ 7
        | \u00A0 \u00A0~
        |ˎ \u00A0 \u00A0 \u00A0ヽ
        じしf_,)ノ
      `);
  };
}