export function redifyListMock(adsArray: NodeListOf<HTMLElement>) {
  for (let i = 0; i < adsArray.length; i++) {
    adsArray[i].style.backgroundColor = 'red'
  }
}
export function getAdsMock() {
  const adContainer: HTMLElement | null = document.getElementById('tads')
  adContainer &&
    redifyListMock(
      adContainer.querySelectorAll(
        'div[data-text-ad]'
      ) as NodeListOf<HTMLElement>
    )

  const shoppingAdContainer: HTMLCollection | null =
    document.getElementsByClassName('cu-container')
  shoppingAdContainer &&
    redifyListMock(
      shoppingAdContainer[0].querySelectorAll(
        'a[data-offer-id]'
      ) as NodeListOf<HTMLElement>
    )
}

export const mockWithDataText = (
  <body>
    <div>
      <div data-text-ad="1"></div>
    </div>
    <div>
      <div>
        <div>
          <a></a>
        </div>
      </div>
    </div>
    <div>
      <div>
        <h1>Test</h1>
        <div>
          <div data-text-ad="1"></div>
        </div>
      </div>
    </div>
  </body>
)

export const mockWithShopping = (
  <body>
    <div>
      <div></div>
    </div>
    <div>
      <div>
        <div>
          <a></a>
        </div>
      </div>
    </div>
    <div className="cu-container">
      <div>
        <h1>Test</h1>
        <div>
          <div>
            <a data-offer-id="1" />
            <a data-offer-id="1" />
          </div>
        </div>
        <a data-offer-id="1" />
      </div>
    </div>
  </body>
)

export const mockWithNothing = (
  <body>
    <div>
      <div></div>
    </div>
    <div>
      <div>
        <div>
          <a></a>
        </div>
      </div>
    </div>
    <div>
      <div>
        <h1>Test</h1>
        <div>
          <div></div>
        </div>
      </div>
    </div>
  </body>
)
