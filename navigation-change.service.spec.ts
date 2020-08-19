import { NavigationChangeService } from './navigation-change.service'; 

describe('NavigationChangeService', () => {
  let service: NavigationChangeService;

  beforeEach(() => {
    service = new NavigationChangeService;
  });

  it('should set up getMenuChanges with null at start', () => {
    service.getMenuChanges$.subscribe(value => {
      expect(value).toBe(null);
    });
  });

  it('should populate menuChanges when menuChange() is called', () => {
    service.menuChange();
    service.getMenuChanges$.subscribe(value => {
      expect(value).not.toBe(null);
    });
  });

  it('should set up getInnerNavChanges with null at start', () => {
    service.getInnerNavChanges().subscribe(value => {
      expect(value).toBe(null);
    });
  });

  it('should set up getInnerNavChanges (for breadcrumb only) with null at start', () => {
    service.getInnerNavChanges(true).subscribe(value => {
      expect(value).toBe(null);
    });
  });

  it('should populate innerNavChanges when innerNavChange() is called', () => {
    service.innerNavChange('new-section');
    service.getInnerNavChanges().subscribe(value => {
      expect(value).not.toBe(null);
      expect(value).toBe('new-section');
    });
  });

  it('should populate innerNavChanges (meant for breadcrumb only) when innerNavChange() is called with boolean', () => {
    service.innerNavChange('new-section-for-breadcrumb', true);
    service.getInnerNavChanges(true).subscribe(value => {
      expect(value).not.toBe(null);
      expect(value).toBe('new-section-for-breadcrumb');
    });
  });

  it('should not populate innerNavChanges for breadcrumb when innerNavChange() is called without boolean', () => {
    service.innerNavChange('new-update-not-meant-for-breadcrumb');
    service.getInnerNavChanges(true).subscribe(value => {
      expect(value).not.toBe('new-update-not-meant-for-breadcrumb');
      expect(value).toBe(null);
    });
  });
});
