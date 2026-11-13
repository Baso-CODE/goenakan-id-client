import { strict as assert } from "node:assert";
import { isSameCartConfiguration } from "../app/lib/cart/cartItemIdentity";

const base = {
  productId: "product-test",
  variantId: "variant-test",
  selectedAttributes: {
    Color: "Black",
  },
};

const logoA = {
  ...base,
  customization: {
    logo: {
      name: "logo-a.png",
      image: "data:image/png;base64,AAAA",
    },
  },
};

const logoB = {
  ...base,
  customization: {
    logo: {
      name: "logo-b.png",
      image: "data:image/png;base64,BBBB",
    },
  },
};

const logoACopy = {
  ...base,
  customization: {
    logo: {
      image: "data:image/png;base64,AAAA",
      name: "logo-a.png",
    },
  },
};

const plain = {
  ...base,
  customization: null,
};

const plainEmptyObject = {
  ...base,
  customization: {},
};

const tests = [
  {
    name: "Logo berbeda tidak boleh digabung",
    actual: isSameCartConfiguration(logoA, logoB),
    expected: false,
  },
  {
    name: "Logo identik harus dikenali sebagai item sama",
    actual: isSameCartConfiguration(logoA, logoACopy),
    expected: true,
  },
  {
    name: "Produk polos berbeda dari produk berlogo",
    actual: isSameCartConfiguration(plain, logoA),
    expected: false,
  },
  {
    name: "Urutan properti object tidak memengaruhi identitas",
    actual: isSameCartConfiguration(logoACopy, logoA),
    expected: true,
  },
  {
    name: "Konfigurasi null dan object kosong berbeda",
    actual: isSameCartConfiguration(plain, plainEmptyObject),
    expected: false,
  },
];

let passed = 0;

for (const test of tests) {
  try {
    assert.equal(test.actual, test.expected);
    console.log(`PASS: ${test.name}`);
    passed++;
  } catch {
    console.error(`FAIL: ${test.name}`);
    process.exitCode = 1;
  }
}

console.log(`\nResult: ${passed}/${tests.length} tests passed`);
