/* 추가 인터랙션 작성 예시 — index.html에는 아직 연결하지 않았습니다.
 * 1. config.js의 extra01 항목에 이름·에셋·영상 경로를 넣습니다.
 * 2. index.html에 id="extra01View"인 영역을 추가합니다.
 * 3. 아래 예시의 버튼을 실제 게임 동작으로 교체하고, 성공 시 flow.complete() 호출.
 * 4. 이 파일을 interactions/extra01.js로 복사하고 boot.js 앞에 script로 연결합니다.
 */
FishApp.registerInteraction('extra01', {
  viewId: 'extra01View',
  mount(root, flow) {
    let scope = null;
    return {
      start() {
        scope?.abort();
        scope = new RunScope();
        // 이 예시에서는 버튼 클릭을 성공으로 봅니다. 실제 게임의 성공 판정으로 교체하세요.
        scope.listen(root.querySelector('[data-complete]'), 'click', () => flow.complete());
      },
      stop() { scope?.abort(); scope = null; },
      reset() {
        // 점수, 횟수, 드래그 위치, 선택된 아이템 등 이 게임의 상태를 초기화하세요.
      },
    };
  },
});
