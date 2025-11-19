<!--
=== SYNC IMPACT REPORT (v1.1.0) ===
Version Bump: 1.0.0 → 1.1.0 (MINOR: Testing principles added)

Principles Added (v1.1.0):
  - VI. Test-Driven Development (TDD)
  - VII. Testing Stack Standardization (Playwright + Vitest)
  - VIII. Code Quality & Testability

Principles Retained (v1.0.0):
  - I. Content-Driven Architecture (Sanity-first)
  - II. Type Safety & Schema Consistency
  - III. Payment System Reliability
  - IV. User Experience & Performance
  - V. Security & Data Protection

Sections Added/Modified:
  ✅ Technology Stack Requirements: Added testing tools (Playwright, Vitest, test runners)
  ✅ Development Workflow: Expanded testing gates with TDD requirements
  ✅ Governance: Added testing compliance review checklist

Templates Requiring Review:
  ✅ plan-template.md: Now includes TDD feasibility checks
  ✅ spec-template.md: Now requires test plan section
  ✅ tasks-template.md: Now includes test-first task types
  ⚠ agent-file-template.md: Manual review recommended

Original Ratification: 2025-11-19 (v1.0.0)
Amendment Date: 2025-11-19 (v1.1.0)
===
-->

# Bookish Bliss Constitution

## Core Principles

### I. Content-Driven Architecture (Sanity-First)

All product data, categories, and site settings MUST be managed through Sanity CMS. No hardcoded content in code. Every feature that surfaces content MUST:
- Use GROQ queries to fetch data from Sanity
- Respect published/draft states and scheduling
- Cache queries where appropriate (Next.js static generation preferred)
- Document query changes in commit messages
- Never store content in database/localStorage—Sanity is the single source of truth

**Rationale**: Separation of content management from code enables non-technical staff to manage the bookstore, reduces deployment friction, and ensures consistency across all product data.

### II. Type Safety & Schema Consistency

TypeScript interfaces in `lib/interface.ts` MUST mirror Sanity schemas. All product/category/publisher changes MUST:
- First update the Sanity schema in `sanity/schemas/`
- Then update corresponding TypeScript interface
- Then update GROQ queries and components
- Include tests validating schema-interface alignment

**Rationale**: Type safety prevents runtime errors, especially critical for e-commerce where data mismatches affect pricing and checkout flow. Schema-as-single-source-of-truth reduces mental overhead.

### III. Payment System Reliability (Non-Negotiable)

Stripe integration is critical to revenue. All changes to payment flow MUST:
- Have explicit testing in dev/staging with Stripe test mode
- Never modify checkout flow without reviewing `app/api/checkout/route.ts`
- Validate price calculations (cents conversion, shipping, taxes if added)
- Log all Stripe API calls for debugging
- Have a runbook for failed checkouts (e.g., retry logic, manual refunds)

**Rationale**: Payment failures directly impact business revenue. This principle ensures financial correctness and customer trust.

### IV. User Experience & Performance

Customer-facing features MUST prioritize performance and accessibility:
- Next.js Image optimization required for all book covers
- Shopping cart must remain responsive (<50ms operations)
- Mobile-first responsive design (Tailwind breakpoints: md, lg, xl, 2xl)
- Accessibility: ARIA labels, semantic HTML, keyboard navigation
- Lazy loading for product lists, infinite scroll if applicable
- No inline styles—Tailwind utilities only

**Rationale**: E-commerce conversions depend on fast, responsive interfaces. Mobile users represent significant traffic. Accessible design is both ethical and legal requirement.

### V. Security & Data Protection

Customer and payment data MUST be handled securely:
- Never log full credit card numbers or sensitive Stripe data
- Environment variables for all secrets (API keys, project IDs)—never commit to git
- HTTPS enforced in production
- Stripe checkout hosted (never handle raw card data client-side)
- Cart data in localStorage only—no PII stored
- Input validation on all forms before sending to Stripe/Sanity

**Rationale**: Customer data breaches destroy trust and invite legal liability. Payment Card Industry (PCI) compliance requires this discipline.

### VI. Test-Driven Development (TDD)

All new features and bug fixes MUST follow test-first principles:
- Write failing tests before implementation (Red-Green-Refactor cycle)
- Unit tests for business logic (utilities, hooks, Sanity queries)
- Integration tests for feature interactions (cart operations, form submissions)
- E2E tests for critical user journeys (browse → add to cart → checkout)
- Aim for 80%+ coverage on critical paths (payment, data fetching, cart state)
- Test code reviewed same rigor as product code
- Failing tests in CI block merge—green builds mandatory

**Rationale**: TDD reduces bugs, improves design, enables confident refactoring, and documents expected behavior. For e-commerce, payment/checkout tests are non-negotiable.

### VII. Testing Stack Standardization

The following testing stack is mandatory—no exceptions:
- **Unit/Integration Tests**: Vitest (with jsdom for DOM testing) — replaces Jest by default
- **E2E Tests**: Playwright — all critical user journeys must have Playwright tests
- **Test Runner**: npm run test (unit), npm run test:e2e (E2E), npm run test:ci (both with coverage)
- **Coverage Reports**: Generated on every test run; target 80%+ for critical paths
- **Mocking**: Use vitest.mock() for Sanity client, Stripe API, Next.js features
- **CI/CD Integration**: All tests run on every PR; blocking failures prevent merge

**Rationale**: Standardized tooling ensures consistency, reduces onboarding friction, and enables automation. Playwright + Vitest are modern, Next.js-optimized, and encourage fast feedback loops.

### VIII. Code Quality & Testability

Code MUST be written with testability as a design constraint:
- Components MUST export both default and named exports (default for lazy loading, named for testing)
- Business logic MUST be separated from React components (custom hooks, utility functions)
- API routes MUST have isolated logic testable without HTTP calls (use dependency injection or test helpers)
- No tight coupling to external services—Sanity/Stripe clients MUST be injectable/mockable
- Avoid side effects in render paths—useEffect dependencies critical for test isolation
- Test utilities and fixtures in `__tests__/fixtures` or `__tests__/utils` directories

**Rationale**: Testable code is maintainable code. Clear separation of concerns enables fast unit tests and reduces E2E test brittleness. Isolation prevents test flakiness.

## Technology Stack Requirements

The following stack is mandatory and changes require constitution amendment:
- **Framework**: Next.js 14 (App Router)—no migration to Pages Router or other frameworks without approval
- **CMS**: Sanity v3—schema changes require careful versioning
- **Styling**: Tailwind CSS + shadcn/ui components—no custom CSS frameworks mixed in
- **Payments**: Stripe Checkout (hosted model)—no alternative payment gateways without major review
- **State Management**: React Context API with localStorage—no Redux/Zustand without justification
- **Database**: None (Sanity is the system of record)
- **Unit/Integration Testing**: Vitest with jsdom—all unit tests use Vitest
- **E2E Testing**: Playwright—all critical user journeys tested with Playwright
- **Test Coverage**: Coverage reports generated on every test run via Vitest

All third-party dependencies MUST be justified in PRs. Security updates are non-negotiable. Testing tool changes require constitutional amendment (MAJOR bump).

## Development Workflow

### Code Review Requirements
- All PRs must verify schema/type alignment if touching data
- Payment changes require explicit sign-off
- Performance regressions (image loading, checkout flow) must be flagged
- Security checklist: no hardcoded secrets, no logging sensitive data
- **TDD Checklist**: Tests written first? Red-Green-Refactor cycle documented? 80%+ coverage on critical paths?
- **Test Quality**: Are tests isolated, maintainable, and testing behavior (not implementation details)?

### Testing Gate
- New product fields must have tests validating Sanity-to-TypeScript flow
- Stripe checkout flow changes must test price calculations and edge cases
- Components touching cart state must validate localStorage persistence
- **Unit Tests Required**: All utility functions, custom hooks, Sanity query builders
- **Integration Tests Required**: Cart operations (add, remove, increment, checkout flow)
- **E2E Tests Required**: Critical journeys (browse products → filter → add to cart → checkout → success)
- All tests must pass locally before PR submission
- CI/CD must run full test suite; failing tests block merge

### TDD-First Workflow
1. Define feature requirements in spec
2. Write failing test(s) that specify expected behavior
3. Implement minimal code to pass tests
4. Refactor for clarity and maintainability
5. Verify coverage meets 80%+ threshold for critical paths
6. Submit PR with tests + implementation (never separate)

### Deployment Approval
- Sanity schema changes must be deployed before code that uses them
- Payment system changes require staging environment validation with Stripe test mode
- Database migrations N/A (CMS handles schema)
- All tests must pass in CI/CD before production deployment
- Coverage reports must show 80%+ on critical paths

## Governance

**Amendment Procedure**: Changes to this constitution require discussion and documentation before implementation. The Ratification Date marks the original adoption. Amendments MUST increment the version number per semantic versioning:
- **MAJOR**: Principle removal or radical redefinition (e.g., switching from Sanity to another CMS)
- **MINOR**: New principle added, or major expansion of principle scope
- **PATCH**: Clarifications, wording refinement, or procedural updates

**Compliance Review**: Before every major release, the team MUST verify:
1. No hardcoded content exists
2. Sanity schemas and TypeScript interfaces are in sync
3. Stripe checkout logic is tested and validated with test mode
4. Mobile/performance targets are met
5. No secrets are committed
6. All tests pass; coverage ≥80% on critical paths
7. E2E tests run successfully for critical user journeys
8. Test code follows same quality standards as product code
9. Vitest unit test suite completes in <30 seconds (performance gate)
10. Playwright E2E suite completes in <5 minutes (performance gate)

**Test Maintenance**: Test failures MUST be addressed within 24 hours. Flaky tests MUST be fixed immediately (disable and document if not fixable). Test code is documentation—keep it clean and readable.

**Runtime Guidance**: See `CLAUDE.md` for development patterns and `README.md` for architecture overview. See `TESTING.md` (to be created) for testing conventions and examples.

---

**Version**: 1.1.0 | **Ratified**: 2025-11-19 (v1.0.0) | **Last Amended**: 2025-11-19 (v1.1.0 - TDD & Testing Principles)
